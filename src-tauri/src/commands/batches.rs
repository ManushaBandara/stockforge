use crate::{
    db::DbState,
    models::batch::{Batch, CreateBatchInput},
    services::batches,
};

use tauri::State;

#[tauri::command]
pub async fn create_batch(
    state: State<'_, DbState>,
    input: CreateBatchInput,
) -> Result<Batch, String> {
    batches::create_batch(&state.pool, input)
        .await
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn get_batches(state: State<'_, DbState>) -> Result<Vec<Batch>, String> {
    batches::get_batches(&state.pool)
        .await
        .map_err(|error| error.to_string())
}
