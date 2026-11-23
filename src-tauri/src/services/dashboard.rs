use sqlx::{Row, SqlitePool};

use crate::models::dashboard::{DashboardData, DashboardPipeline, DashboardStats, RecentAsset};

pub async fn get_dashboard_data(pool: &SqlitePool) -> Result<DashboardData, sqlx::Error> {
    // KPI statistics
    let stats_row = sqlx::query(
        r#"
        SELECT
            COUNT(*) AS total_assets,

            COALESCE(SUM(CASE
                WHEN status = 'ready_to_submit' THEN 1
                ELSE 0
            END), 0) AS ready_to_submit,

            COALESCE(SUM(CASE
                WHEN status IN ('processing', 'metadata_pending') THEN 1
                ELSE 0
            END), 0) AS in_production,

            COALESCE(SUM(CASE
                WHEN submission_status IN ('submitted', 'in_review', 'published')
                THEN 1
                ELSE 0
            END), 0) AS submitted

        FROM assets
        WHERE deleted_at IS NULL
          AND is_archived = 0
        "#,
    )
    .fetch_one(pool)
    .await?;

    let stats = DashboardStats {
        total_assets: stats_row.try_get("total_assets")?,
        ready_to_submit: stats_row.try_get("ready_to_submit")?,
        in_production: stats_row.try_get("in_production")?,
        submitted: stats_row.try_get("submitted")?,
    };

    // Production pipeline counts
    let pipeline_row = sqlx::query(
        r#"
        SELECT
            COALESCE(SUM(CASE
                WHEN status = 'published' THEN 1
                ELSE 0
            END), 0) AS completed,

            COALESCE(SUM(CASE
                WHEN status IN ('processing', 'metadata_pending')
                THEN 1 ELSE 0
            END), 0) AS processing,

            COALESCE(SUM(CASE
                WHEN status IN (
                    'imported',
                    'metadata_review',
                    'ready_to_submit',
                    'queued'
                )
                THEN 1 ELSE 0
            END), 0) AS pending,

            COALESCE(SUM(CASE
                WHEN status = 'failed' THEN 1
                ELSE 0
            END), 0) AS failed,

            COALESCE(SUM(CASE
                WHEN status = 'rejected' THEN 1
                ELSE 0
            END), 0) AS rejected

        FROM assets
        WHERE deleted_at IS NULL
          AND is_archived = 0
        "#,
    )
    .fetch_one(pool)
    .await?;

    let pipeline = DashboardPipeline {
        completed: pipeline_row.try_get("completed")?,
        processing: pipeline_row.try_get("processing")?,
        pending: pipeline_row.try_get("pending")?,
        failed: pipeline_row.try_get("failed")?,
        rejected: pipeline_row.try_get("rejected")?,
    };

    // Latest 5 assets
    let recent_rows = sqlx::query(
        r#"
        SELECT
            a.id,
            COALESCE(NULLIF(a.display_name, ''), a.original_filename) AS name,
            COALESCE(b.category, 'Uncategorized') AS category,
            a.status,
            a.submission_status,
            a.created_at

        FROM assets a

        LEFT JOIN batches b
            ON b.id = a.batch_id

        WHERE a.deleted_at IS NULL
          AND a.is_archived = 0

        ORDER BY a.created_at DESC

        LIMIT 5
        "#,
    )
    .fetch_all(pool)
    .await?;

    let recent_assets = recent_rows
        .into_iter()
        .map(|row| {
            Ok(RecentAsset {
                id: row.try_get("id")?,
                name: row.try_get("name")?,
                category: row.try_get("category")?,
                status: row.try_get("status")?,
                submission_status: row.try_get("submission_status")?,
                created_at: row.try_get("created_at")?,
            })
        })
        .collect::<Result<Vec<RecentAsset>, sqlx::Error>>()?;

    Ok(DashboardData {
        stats,
        pipeline,
        recent_assets,
    })
}
