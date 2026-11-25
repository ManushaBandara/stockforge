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

use sqlx::Row;

#[tauri::command]
pub async fn diagnose_metadata_database(
    state: tauri::State<'_, crate::db::DbState>,
) -> Result<String, String> {
    let databases = sqlx::query("PRAGMA database_list")
        .fetch_all(&state.pool)
        .await
        .map_err(|e| e.to_string())?;

    let columns = sqlx::query("PRAGMA table_info(assets)")
        .fetch_all(&state.pool)
        .await
        .map_err(|e| e.to_string())?;

    let mut output = String::new();

    output.push_str("CONNECTED DATABASES:\n");

    for row in databases {
        let name: String = row.try_get("name").map_err(|e| e.to_string())?;
        let path: String = row.try_get("file").map_err(|e| e.to_string())?;

        output.push_str(&format!("{name}: {path}\n"));
    }

    output.push_str("\nASSETS TABLE COLUMNS:\n");

    for row in columns {
        let name: String = row.try_get("name").map_err(|e| e.to_string())?;
        output.push_str(&format!("{name}\n"));
    }

    Ok(output)
}
