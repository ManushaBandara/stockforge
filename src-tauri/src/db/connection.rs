use sqlx::{
    SqlitePool,
    sqlite::{SqliteConnectOptions, SqliteJournalMode, SqlitePoolOptions},
};
use std::path::PathBuf;

pub async fn create_pool() -> Result<SqlitePool, sqlx::Error> {
    let project_root = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
        .parent()
        .expect("Failed to resolve project root")
        .to_path_buf();

    let database_path = project_root.join("dev-db").join("stockforge.db");

    let options = SqliteConnectOptions::new()
        .filename(&database_path)
        .create_if_missing(false)
        // If database path is wrong, StockForge should fail rather than silently create an empty database
        .foreign_keys(true)
        .journal_mode(SqliteJournalMode::Wal);

    SqlitePoolOptions::new()
        .max_connections(5)
        .connect_with(options)
        .await
}
