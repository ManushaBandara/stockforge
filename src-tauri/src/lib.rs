mod commands;
mod db;
mod errors;
mod models;
mod services;

use db::DbState;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .setup(|app| {
            let pool = tauri::async_runtime::block_on(db::create_pool()).map_err(|error| {
                std::io::Error::other(format!("Failed to connect to StockForge database: {error}"))
            })?;

            let default_storage_path = app
                .path()
                .app_data_dir()
                .map_err(|error| {
                    std::io::Error::other(format!("Failed to resolve app data directory: {error}"))
                })?
                .join("assets");

            tauri::async_runtime::block_on(async {
                let mut preferences =
                    crate::services::settings::get_setting(&pool, "app.preferences")
                        .await
                        .map_err(|error| {
                            std::io::Error::other(format!(
                                "Failed to load app preferences: {error}"
                            ))
                        })?
                        .unwrap_or_else(|| serde_json::json!({}));

                let has_storage_path = preferences
                    .get("storagePath")
                    .and_then(serde_json::Value::as_str)
                    .is_some_and(|path| !path.trim().is_empty());

                if !has_storage_path {
                    if !preferences.is_object() {
                        preferences = serde_json::json!({});
                    }
                    preferences["storagePath"] =
                        serde_json::json!(default_storage_path.to_string_lossy().to_string());

                    crate::services::settings::set_setting(&pool, "app.preferences", &preferences)
                        .await
                        .map_err(|error| {
                            std::io::Error::other(format!(
                                "Failed to initialize app preferences: {error}"
                            ))
                        })?;
                }

                Ok::<(), std::io::Error>(())
            })?;

            app.manage(DbState { pool });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::system::get_database_status,
            commands::settings::get_setting,
            commands::settings::set_setting,
            commands::dashboard::get_dashboard_data,
            commands::credentials::save_gemini_api_key,
            commands::credentials::has_gemini_api_key,
            commands::credentials::delete_gemini_api_key,
            commands::ai::generate_ai_content,
            commands::ai::test_gemini_connection,
            commands::stock_ideas::create_stock_idea,
            commands::stock_ideas::get_stock_ideas,
            commands::metadata_studio::get_metadata_studio_data,
            commands::metadata_studio::import_manual_image,
            commands::batches::create_batch,
            commands::batches::get_batches,
            commands::manual_assets::import_manual_batch_assets,
        ])
        .run(tauri::generate_context!())
        .expect("Failed to run StockForge");
}
