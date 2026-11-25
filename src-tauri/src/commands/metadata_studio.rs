use tauri::State;

use crate::{db::DbState, models::metadata_studio::MetadataStudioData, services::metadata_studio};

#[tauri::command]
pub async fn get_metadata_studio_data(
    state: State<'_, DbState>,
) -> Result<MetadataStudioData, String> {
    metadata_studio::get_metadata_studio_data(&state.pool)
        .await
        .map_err(|error| error.to_string())
}
