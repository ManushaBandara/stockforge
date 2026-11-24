use crate::{
    db::DbState,
    models::stock_idea::{CreateStockIdeaInput, StockIdea},
    services::stock_ideas,
};
use tauri::State;

#[tauri::command]
pub async fn create_stock_idea(
    state: State<'_, DbState>,
    input: CreateStockIdeaInput,
) -> Result<StockIdea, String> {
    stock_ideas::create_stock_idea(&state.pool, input)
        .await
        .map_err(|error| error.to_string())
}

#[tauri::command]
pub async fn get_stock_ideas(
    state: State<'_, DbState>,
) -> Result<Vec<StockIdea>, String> {
    stock_ideas::get_stock_ideas(&state.pool)
        .await
        .map_err(|error| error.to_string())
}
