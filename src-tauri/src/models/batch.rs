use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateBatchInput {
    pub name: String,
    pub description: Option<String>,
    pub category: Option<String>,
    pub style: Option<String>,
    pub target_count: Option<i64>,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct Batch {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub category: Option<String>,
    pub style: Option<String>,
    pub target_count: i64,
    pub status: String,
    pub created_at: String,
    pub updated_at: String,
    pub asset_count: i64,
}
