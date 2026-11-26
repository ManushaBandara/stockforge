use crate::{
    errors::{AppError, AppResult},
    models::manual_asset::ManualAssetInput,
};

use serde_json::Value;
use sqlx::SqlitePool;
use std::{
    fs,
    path::{Path, PathBuf},
};
use uuid::Uuid;

const MAX_FILE_SIZE: u64 = 100 * 1024 * 1024;

pub async fn import_manual_batch_assets(
    pool: &SqlitePool,
    batch_id: &str,
    assets: Vec<ManualAssetInput>,
) -> AppResult<Vec<String>> {
    if assets.is_empty() {
        return Err(AppError::InvalidInput(
            "Select at least one photograph".into(),
        ));
    }

    if assets.len() > 100 {
        return Err(AppError::InvalidInput(
            "A maximum of 100 photographs can be imported at once".into(),
        ));
    }

    let batch_exists: bool =
        sqlx::query_scalar("SELECT EXISTS(SELECT 1 FROM batches WHERE id = ?)")
            .bind(batch_id)
            .fetch_one(pool)
            .await?;

    if !batch_exists {
        return Err(AppError::InvalidInput("Batch not found".into()));
    }

    let preferences: Option<String> =
        sqlx::query_scalar("SELECT value_json FROM app_settings WHERE key = 'app.preferences'")
            .fetch_optional(pool)
            .await?;

    let preferences: Value = preferences
        .map(|value| serde_json::from_str(&value))
        .transpose()?
        .unwrap_or(Value::Null);

    let storage_path = preferences
        .get("storagePath")
        .and_then(Value::as_str)
        .filter(|path| !path.trim().is_empty())
        .ok_or_else(|| {
            AppError::InvalidInput("Configure the asset storage path in Settings first".into())
        })?;

    let originals_dir = PathBuf::from(storage_path).join("originals").join(batch_id);

    fs::create_dir_all(&originals_dir)?;

    let mut prepared = Vec::with_capacity(assets.len());

    for asset in assets {
        let title = asset.title.trim();
        let description = asset.description.trim();
        let category = asset.category.trim();

        if title.is_empty() || category.is_empty() {
            cleanup_files(&prepared);

            return Err(AppError::InvalidInput(
                "Every photograph needs a title and category".into(),
            ));
        }

        let source = Path::new(&asset.source_path);

        if !source.is_file() {
            cleanup_files(&prepared);

            return Err(AppError::InvalidInput(format!(
                "Image file does not exist: {}",
                source.display()
            )));
        }

        let extension = source
            .extension()
            .and_then(|value| value.to_str())
            .map(str::to_lowercase)
            .ok_or_else(|| AppError::InvalidInput("Image file has no extension".into()))?;

        if !["jpg", "jpeg", "png", "webp", "tif", "tiff"].contains(&extension.as_str()) {
            cleanup_files(&prepared);

            return Err(AppError::InvalidInput(format!(
                "Unsupported image format: {extension}"
            )));
        }

        let metadata = fs::metadata(source)?;

        if metadata.len() == 0 || metadata.len() > MAX_FILE_SIZE {
            cleanup_files(&prepared);

            return Err(AppError::InvalidInput(format!(
                "Invalid image size: {}",
                source.display()
            )));
        }

        let asset_id = Uuid::new_v4().to_string();
        let filename = source
            .file_name()
            .and_then(|value| value.to_str())
            .unwrap_or("image")
            .to_string();

        let destination = originals_dir.join(format!("{asset_id}.{extension}"));

        if let Err(error) = fs::copy(source, &destination) {
            cleanup_files(&prepared);
            return Err(error.into());
        }

        let mime_type = match extension.as_str() {
            "jpg" | "jpeg" => "image/jpeg",
            "png" => "image/png",
            "webp" => "image/webp",
            "tif" | "tiff" => "image/tiff",
            _ => "application/octet-stream",
        };

        let keywords: Vec<String> = asset
            .keywords
            .into_iter()
            .map(|keyword| keyword.trim().to_string())
            .filter(|keyword| !keyword.is_empty())
            .fold(Vec::new(), |mut result, keyword| {
                if !result
                    .iter()
                    .any(|existing| existing.eq_ignore_ascii_case(&keyword))
                {
                    result.push(keyword);
                }
                result
            });

        if keywords.len() > 50 {
            let _ = fs::remove_file(&destination);
            cleanup_files(&prepared);

            return Err(AppError::InvalidInput(
                "A photograph cannot have more than 50 keywords".into(),
            ));
        }

        prepared.push(PreparedAsset {
            id: asset_id,
            filename,
            destination,
            mime_type: mime_type.to_string(),
            file_size: metadata.len() as i64,
            title: title.to_string(),
            description: description.to_string(),
            category: category.to_string(),
            keywords,
        });
    }

    let mut transaction = pool.begin().await?;

    let result: AppResult<Vec<String>> = async {
        let mut imported_ids = Vec::with_capacity(prepared.len());

        for asset in &prepared {
            let metadata_id = Uuid::new_v4().to_string();

            sqlx::query(
                r#"
                INSERT INTO assets (
                    id,
                    batch_id,
                    original_filename,
                    display_name,
                    status,
                    metadata_status,
                    submission_status,
                    source_type,
                    created_at,
                    updated_at
                )
                VALUES (
                    ?, ?, ?, ?,
                    'metadata_review',
                    'review_required',
                    'not_submitted',
                    'manual',
                    datetime('now'),
                    datetime('now')
                )
                "#,
            )
            .bind(&asset.id)
            .bind(batch_id)
            .bind(&asset.filename)
            .bind(&asset.title)
            .execute(&mut *transaction)
            .await?;

            sqlx::query(
                r#"
                INSERT INTO asset_files (
                    id,
                    asset_id,
                    file_type,
                    storage_path,
                    filename,
                    mime_type,
                    file_size,
                    created_at
                )
                VALUES (?, ?, 'original', ?, ?, ?, ?, datetime('now'))
                "#,
            )
            .bind(Uuid::new_v4().to_string())
            .bind(&asset.id)
            .bind(asset.destination.to_string_lossy().to_string())
            .bind(&asset.filename)
            .bind(&asset.mime_type)
            .bind(asset.file_size)
            .execute(&mut *transaction)
            .await?;

            sqlx::query(
                r#"
                INSERT INTO metadata_revisions (
                    id,
                    asset_id,
                    revision_number,
                    title,
                    description,
                    category,
                    keyword_count,
                    generated_by,
                    status,
                    is_current,
                    created_at
                )
                VALUES (?, ?, 1, ?, ?, ?, ?, 'manual',
                        'review_required', 1, datetime('now'))
                "#,
            )
            .bind(&metadata_id)
            .bind(&asset.id)
            .bind(&asset.title)
            .bind(&asset.description)
            .bind(&asset.category)
            .bind(asset.keywords.len() as i64)
            .execute(&mut *transaction)
            .await?;

            for (position, keyword) in asset.keywords.iter().enumerate() {
                sqlx::query(
                    r#"
                    INSERT INTO metadata_keywords (
                        id,
                        metadata_revision_id,
                        keyword,
                        position,
                        created_at
                    )
                    VALUES (?, ?, ?, ?, datetime('now'))
                    "#,
                )
                .bind(Uuid::new_v4().to_string())
                .bind(&metadata_id)
                .bind(keyword)
                .bind(position as i64)
                .execute(&mut *transaction)
                .await?;
            }

            imported_ids.push(asset.id.clone());
        }

        sqlx::query(
            r#"
            UPDATE batches
            SET
                target_count = (
                    SELECT COUNT(*)
                    FROM assets
                    WHERE batch_id = ?
                      AND deleted_at IS NULL
                      AND is_archived = 0
                ),
                status = 'active',
                updated_at = datetime('now')
            WHERE id = ?
            "#,
        )
        .bind(batch_id)
        .bind(batch_id)
        .execute(&mut *transaction)
        .await?;

        Ok(imported_ids)
    }
    .await;

    match result {
        Ok(ids) => {
            if let Err(error) = transaction.commit().await {
                cleanup_files(&prepared);
                return Err(error.into());
            }

            Ok(ids)
        }
        Err(error) => {
            let _ = transaction.rollback().await;
            cleanup_files(&prepared);
            Err(error)
        }
    }
}

struct PreparedAsset {
    id: String,
    filename: String,
    destination: PathBuf,
    mime_type: String,
    file_size: i64,
    title: String,
    description: String,
    category: String,
    keywords: Vec<String>,
}

fn cleanup_files(assets: &[PreparedAsset]) {
    for asset in assets {
        let _ = fs::remove_file(&asset.destination);
    }
}
