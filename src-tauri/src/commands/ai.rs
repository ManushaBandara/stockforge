use crate::services::ai;
use tauri::command;

#[command]
pub async fn generate_ai_content(
    prompt: String,
) -> Result<ai::GeminiGeneration, String> {
    if prompt.trim().is_empty() {
        return Err("Prompt cannot be empty".to_string());
    }

    ai::generate_grounded_content(&prompt).await
}

#[command]
pub async fn test_gemini_connection() -> Result<String, String> {
    ai::test_gemini_connection().await
}