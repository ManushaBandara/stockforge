use serde::Deserialize;

#[derive(Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ManualAssetInput {
    pub source_path: String,
    pub title: String,
    pub description: String,
    pub category: String,
    pub keywords: Vec<String>,
}
