use serde::Serialize;

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DashboardStats {
    pub total_assets: i64,
    pub ready_to_submit: i64,
    pub in_production: i64,
    pub submitted: i64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DashboardPipeline {
    pub completed: i64,
    pub processing: i64,
    pub pending: i64,
    pub failed: i64,
    pub rejected: i64,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RecentAsset {
    pub id: String,
    pub name: String,
    pub category: String,
    pub status: String,
    pub submission_status: String,
    pub created_at: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct DashboardData {
    pub stats: DashboardStats,
    pub pipeline: DashboardPipeline,
    pub recent_assets: Vec<RecentAsset>,
}
