use crate::{
    errors::AppResult,
    models::batch::{Batch, CreateBatchInput},
};

use sqlx::{Row, SqlitePool};
use uuid::Uuid;

pub async fn create_batch(pool: &SqlitePool, input: CreateBatchInput) -> AppResult<Batch> {
    let name = input.name.trim();

    if name.is_empty() {
        return Err(crate::errors::AppError::InvalidInput(
            "Batch name cannot be empty".to_string(),
        ));
    }

    if name.len() > 120 {
        return Err(crate::errors::AppError::InvalidInput(
            "Batch name cannot exceed 120 characters".to_string(),
        ));
    }

    let target_count = input.target_count.unwrap_or(0);

    if target_count < 0 {
        return Err(crate::errors::AppError::InvalidInput(
            "Target count cannot be negative".to_string(),
        ));
    }

    let id = Uuid::new_v4().to_string();

    sqlx::query(
        r#"
        INSERT INTO batches (
            id,
            name,
            description,
            category,
            style,
            target_count,
            status,
            created_at,
            updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, 'draft', datetime('now'), datetime('now'))
        "#,
    )
    .bind(&id)
    .bind(name)
    .bind(input.description)
    .bind(input.category)
    .bind(input.style)
    .bind(target_count)
    .execute(pool)
    .await?;

    get_batch_by_id(pool, &id).await
}

pub async fn get_batches(pool: &SqlitePool) -> AppResult<Vec<Batch>> {
    let rows = sqlx::query(
        r#"
        SELECT
            b.id,
            b.name,
            b.description,
            b.category,
            b.style,
            b.target_count,
            b.status,
            b.created_at,
            b.updated_at,
            COUNT(a.id) AS asset_count

        FROM batches b

        LEFT JOIN assets a
            ON a.batch_id = b.id
            AND a.deleted_at IS NULL
            AND a.is_archived = 0

        GROUP BY b.id

        ORDER BY b.created_at DESC
        "#,
    )
    .fetch_all(pool)
    .await?;

    rows.into_iter()
        .map(map_batch)
        .collect::<Result<Vec<Batch>, sqlx::Error>>()
        .map_err(Into::into)
}

async fn get_batch_by_id(pool: &SqlitePool, id: &str) -> AppResult<Batch> {
    let row = sqlx::query(
        r#"
        SELECT
            b.id,
            b.name,
            b.description,
            b.category,
            b.style,
            b.target_count,
            b.status,
            b.created_at,
            b.updated_at,
            COUNT(a.id) AS asset_count

        FROM batches b

        LEFT JOIN assets a
            ON a.batch_id = b.id
            AND a.deleted_at IS NULL
            AND a.is_archived = 0

        WHERE b.id = ?

        GROUP BY b.id
        "#,
    )
    .bind(id)
    .fetch_one(pool)
    .await?;

    Ok(map_batch(row)?)
}

fn map_batch(row: sqlx::sqlite::SqliteRow) -> Result<Batch, sqlx::Error> {
    Ok(Batch {
        id: row.try_get("id")?,
        name: row.try_get("name")?,
        description: row.try_get("description")?,
        category: row.try_get("category")?,
        style: row.try_get("style")?,
        target_count: row.try_get("target_count")?,
        status: row.try_get("status")?,
        created_at: row.try_get("created_at")?,
        updated_at: row.try_get("updated_at")?,
        asset_count: row.try_get("asset_count")?,
    })
}
