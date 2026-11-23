use tauri::State;

use crate::{db::DbState, models::dashboard::DashboardData, services::dashboard};

#[tauri::command]
pub async fn get_dashboard_data(state: State<'_, DbState>) -> Result<DashboardData, String> {
    dashboard::get_dashboard_data(&state.pool)
        .await
        .map_err(|error| format!("Failed to load dashboard data: {error}"))
}
