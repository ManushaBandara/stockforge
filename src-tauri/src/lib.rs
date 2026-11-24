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
        .setup(|app| {
            let pool = tauri::async_runtime::block_on(db::create_pool()).map_err(|error| {
                std::io::Error::other(format!("Failed to connect to StockForge database: {error}"))
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
        ])
        .run(tauri::generate_context!())
        .expect("Failed to run StockForge");
}
