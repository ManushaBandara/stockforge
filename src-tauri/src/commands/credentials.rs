use crate::services::credentials;
use tauri::command;

#[command]
pub fn save_gemini_api_key(api_key: String) -> Result<(), String> {
    credentials::save_gemini_api_key(&api_key)
}

#[command]
pub fn has_gemini_api_key() -> Result<bool, String> {
    credentials::has_gemini_api_key()
}

#[command]
pub fn delete_gemini_api_key() -> Result<(), String> {
    credentials::delete_gemini_api_key()
}
