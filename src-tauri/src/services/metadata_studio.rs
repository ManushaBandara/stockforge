use sqlx::{Row, SqlitePool};

use crate::{
    errors::AppResult,
    models::metadata_studio::{MetadataStudioData, MetadataStudioImage, MetadataStudioItem},
};

pub async fn get_metadata_studio_data(pool: &SqlitePool) -> AppResult<MetadataStudioData> {
    let rows = sqlx::query(
        r#"
        SELECT
            si.id AS idea_id,
            si.name,
            si.category,
            si.title,
            si.description,
            si.keywords_json,
            si.image_prompt,
            si.created_at AS idea_created_at,

            a.id AS asset_id,
            a.is_selected,
            a.status AS asset_status,
            a.created_at AS asset_created_at,

            (
                SELECT af.storage_path
                FROM asset_files af
                WHERE af.asset_id = a.id
                  AND af.file_type IN ('original', 'preview')
                ORDER BY
                    CASE af.file_type
                        WHEN 'preview' THEN 0
                        ELSE 1
                    END
                LIMIT 1
            ) AS image_path,

            (
                SELECT j.status
                FROM jobs j
                WHERE j.asset_id = a.id
                  AND j.job_type = 'other'
                  AND json_extract(j.payload_json, '$.task') = 'generate_image'
                ORDER BY j.created_at DESC
                LIMIT 1
            ) AS image_generation_status

        FROM stock_ideas si

        LEFT JOIN assets a
            ON a.stock_idea_id = si.id
            AND a.deleted_at IS NULL
            AND a.is_archived = 0
            AND a.submission_status != 'published'
            AND NOT EXISTS (
                SELECT 1
                FROM submissions s
                WHERE s.asset_id = a.id
                  AND s.status = 'published'
            )

        ORDER BY
            si.created_at DESC,
            a.created_at DESC
        "#,
    )
    .fetch_all(pool)
    .await?;

    let mut items: Vec<MetadataStudioItem> = Vec::new();

    for row in rows {
        let idea_id: String = row.try_get("idea_id")?;

        let item_index = match items.iter().position(|item| item.id == idea_id) {
            Some(index) => index,
            None => {
                let keywords_json: String = row.try_get("keywords_json")?;
                let keywords: Vec<String> = serde_json::from_str(&keywords_json)?;

                items.push(MetadataStudioItem {
                    id: idea_id.clone(),
                    name: row.try_get("name")?,
                    category: row.try_get("category")?,
                    title: row.try_get("title")?,
                    description: row.try_get("description")?,
                    keywords,
                    image_prompt: row.try_get("image_prompt")?,
                    images: Vec::new(),
                    created_at: row.try_get("idea_created_at")?,
                });

                items.len() - 1
            }
        };

        let asset_id: Option<String> = row.try_get("asset_id")?;

        if let Some(asset_id) = asset_id {
            let image_path: Option<String> = row.try_get("image_path")?;

            let image_generation_status: Option<String> = row.try_get("image_generation_status")?;

            let is_selected: bool = row.try_get::<i64, _>("is_selected")? != 0;

            let asset_status: String = row.try_get("asset_status")?;

            let asset_created_at: String = row.try_get("asset_created_at")?;

            let generation_status = image_generation_status.unwrap_or_else(|| {
                if image_path.is_some() {
                    "completed".to_string()
                } else {
                    "not_started".to_string()
                }
            });

            items[item_index].images.push(MetadataStudioImage {
                asset_id,
                image_path,
                image_generation_status: generation_status,
                is_selected,
                status: asset_status,
                created_at: asset_created_at,
            });
        }
    }

    let total = items.len() as i64;

    let missing_images = items
        .iter()
        .filter(|item| !item.images.iter().any(|image| image.image_path.is_some()))
        .count() as i64;

    let images_ready = total - missing_images;

    Ok(MetadataStudioData {
        items,
        total,
        missing_images,
        images_ready,
    })
}
