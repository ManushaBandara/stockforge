
use reqwest::Client;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};

use crate::services::credentials;

const GEMINI_MODEL: &str = "gemini-3.5-flash-lite";
const GEMINI_API_URL: &str =
    "https://generativelanguage.googleapis.com/v1beta/models";

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct GeminiGeneration {
    pub text: String,
    pub grounding_metadata: Option<Value>,
}

pub async fn generate_grounded_content(
    prompt: &str,
) -> Result<GeminiGeneration, String> {
    let api_key = credentials::get_gemini_api_key()?;

    let client = Client::new();

    let url = format!(
        "{}/{}:generateContent",
        GEMINI_API_URL, GEMINI_MODEL
    );

    let request_body = json!({
        "contents": [{
            "role": "user",
            "parts": [{
                "text": prompt
            }]
        }],
        "tools": [{
            "google_search": {}
        }],
        "generationConfig": {
            "temperature": 1.0
        }
    });

    let response = client
        .post(&url)
        .query(&[("key", api_key.as_str())])
        .json(&request_body)
        .send()
        .await
        .map_err(|error| format!("Gemini request failed: {error}"))?;

    let status = response.status();

    let response_body_text = response
    .text()
    .await
    .map_err(|error| format!("Failed to read Gemini response: {error}"))?;

    let response_body: Value = serde_json::from_str(&response_body_text)
        .map_err(|error| {
            format!(
                "Gemini returned invalid JSON (HTTP {status}): {error}. Response: {}",
                response_body_text.chars().take(1000).collect::<String>()
            )
        })?;

    if !status.is_success() {
        let message = response_body["error"]["message"]
            .as_str()
            .unwrap_or("Unknown Gemini API error");

        return Err(format!("Gemini API error ({status}): {message}"));
    }

    let candidate = response_body["candidates"]
        .get(0)
        .ok_or("Gemini returned no candidates")?;

    let text = candidate["content"]["parts"]
        .as_array()
        .and_then(|parts| {
            parts.iter()
                .filter_map(|part| part["text"].as_str())
                .next()
        })
        .ok_or("Gemini returned no text content")?
        .to_string();

    let grounding_metadata = candidate
        .get("groundingMetadata")
        .cloned();

    Ok(GeminiGeneration {
        text,
        grounding_metadata,
    })
}

pub async fn test_gemini_connection() -> Result<String, String> {
    let api_key = credentials::get_gemini_api_key()?;

    let client = Client::new();

    let url = format!(
        "{}/{}:generateContent",
        GEMINI_API_URL, GEMINI_MODEL
    );

    let request_body = json!({
        "contents": [{
            "role": "user",
            "parts": [{
                "text": "Reply with exactly: StockForge connection successful."
            }]
        }],
        "generationConfig": {
            "temperature": 0.0,
            "maxOutputTokens": 30
        }
    });

    let response = client
        .post(&url)
        .query(&[("key", api_key.as_str())])
        .json(&request_body)
        .send()
        .await
        .map_err(|error| format!("Gemini connection failed: {error}"))?;

    let status = response.status();

    let response_body_text = response
    .text()
    .await
    .map_err(|error| format!("Failed to read Gemini response: {error}"))?;

    let response_body: Value = serde_json::from_str(&response_body_text)
        .map_err(|error| {
            format!(
                "Gemini returned invalid JSON (HTTP {status}): {error}. Response: {}",
                response_body_text.chars().take(1000).collect::<String>()
            )
        })?;

    if !status.is_success() {
        let message = response_body["error"]["message"]
            .as_str()
            .unwrap_or("Unknown Gemini API error");

        return Err(format!("Gemini API error ({status}): {message}"));
    }

    let text = response_body["candidates"][0]["content"]["parts"][0]["text"]
        .as_str()
        .ok_or("Gemini returned no response")?;

    Ok(text.to_string())
}