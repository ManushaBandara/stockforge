use crate::db::DbState;
use serde::Serialize;
use sqlx::SqlitePool;
use tauri::State;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DatabaseStatus {
    pub connected: bool,
    pub sqlite_version: String,
    pub table_count: i64,
}
async fn inspect_database(pool: &SqlitePool) -> Result<DatabaseStatus, sqlx::Error> {
    let sqlite_version: String = sqlx::query_scalar("SELECT sqlite_version()")
        .fetch_one(pool)
        .await?;

    let table_count: i64 = sqlx::query_scalar(
        "SELECT COUNT(*) FROM sqlite_master
         WHERE type = 'table'
         AND name NOT LIKE 'sqlite_%'",
    )
    .fetch_one(pool)
    .await?;

    Ok(DatabaseStatus {
        connected: true,
        sqlite_version,
        table_count,
    })
}

#[tauri::command]
pub async fn get_database_status(state: State<'_, DbState>) -> Result<DatabaseStatus, String> {
    inspect_database(&state.pool)
        .await
        .map_err(|error| error.to_string())
}
