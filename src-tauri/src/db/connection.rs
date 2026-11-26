use sqlx::{
    SqlitePool,
    sqlite::{SqliteConnectOptions, SqliteJournalMode, SqlitePoolOptions},
};
use std::{path::PathBuf, time::Duration};

pub async fn create_pool() -> Result<SqlitePool, sqlx::Error> {
    let project_root = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .expect("Failed to resolve project root")
        .to_path_buf();

    let database_path = project_root.join("dev-db").join("stockforge.db");

    let options = SqliteConnectOptions::new()
        .filename(&database_path)
        .create_if_missing(false)
        .foreign_keys(true)
        .journal_mode(SqliteJournalMode::Wal)
        .busy_timeout(Duration::from_secs(10));

    let pool = SqlitePoolOptions::new()
        .max_connections(5)
        .connect_with(options)
        .await?;

    let assets_id_is_primary_key: bool = sqlx::query_scalar(
        "SELECT EXISTS(SELECT 1 FROM pragma_table_info('assets') WHERE name = 'id' AND pk = 1)",
    )
    .fetch_one(&pool)
    .await?;

    if !assets_id_is_primary_key {
        sqlx::query("CREATE UNIQUE INDEX IF NOT EXISTS idx_assets_id_unique_repair ON assets(id)")
            .execute(&pool)
            .await?;
    }

    let metadata_revisions_id_is_primary_key: bool = sqlx::query_scalar(
        "SELECT EXISTS(SELECT 1 FROM pragma_table_info('metadata_revisions') WHERE name = 'id' AND pk = 1)",
    )
    .fetch_one(&pool)
    .await?;

    if !metadata_revisions_id_is_primary_key {
        sqlx::query(
            "CREATE UNIQUE INDEX IF NOT EXISTS idx_metadata_revisions_id_unique_repair ON metadata_revisions(id)",
        )
        .execute(&pool)
        .await?;
    }

    Ok(pool)
}
