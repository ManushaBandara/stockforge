use crate::{db::DbState, models::manual_asset::ManualAssetInput, services::manual_assets};

use tauri::State;

#[tauri::command]
pub async fn import_manual_batch_assets(
    state: State<'_, DbState>,
    batch_id: String,
    assets: Vec<ManualAssetInput>,
) -> Result<Vec<String>, String> {
    manual_assets::import_manual_batch_assets(&state.pool, &batch_id, assets)
        .await
        .map_err(|error| error.to_string())
}
