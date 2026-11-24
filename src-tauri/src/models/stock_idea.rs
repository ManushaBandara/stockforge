use serde::{Deserialize, Serialize};

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct CreateStockIdeaInput {
    pub name: String,
    pub category: String,
    pub trend_research_json: Option<String>,
    pub image_prompt: String,
    pub title: String,
    pub description: String,
    pub keywords_json: String,
    pub full_json: String,
}

#[derive(Debug, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct StockIdea {
    pub id: String,
    pub name: String,
    pub category: String,
    pub trend_research_json: Option<String>,
    pub image_prompt: String,
    pub title: String,
    pub description: String,
    pub keywords_json: String,
    pub full_json: String,
    pub created_at: String,
}
