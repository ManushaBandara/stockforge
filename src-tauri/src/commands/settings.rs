use crate::db::DbState;
use serde_json::Value;
use tauri::State;

#[tauri::command]
pub async fn get_setting(state: State<'_, DbState>, key: String) -> Result<Option<Value>, String> {
    if key.trim().is_empty() {
        return Err("Setting key cannot be empty".to_string());
    }

    crate::services::settings::get_setting(&state.pool, &key)
        .await
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn set_setting(
    state: State<'_, DbState>,
    key: String,
    value: Value,
) -> Result<(), String> {
    let key = key.trim();

    if key.is_empty() {
        return Err("Setting key cannot be empty".to_string());
    }

    if key.len() > 150 {
        return Err("Setting key cannot exceed 150 characters".to_string());
    }

    crate::services::settings::set_setting(&state.pool, key, &value)
        .await
        .map_err(|error| error.to_string())
}
