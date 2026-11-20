use serde_json::Value;
use sqlx::SqlitePool;

pub async fn get_setting(pool: &SqlitePool, key: &str) -> Result<Option<Value>, sqlx::Error> {
    let stored_value: Option<String> =
        sqlx::query_scalar("SELECT value_json FROM app_settings WHERE key = ?")
            .bind(key)
            .fetch_optional(pool)
            .await?;

    match stored_value {
        Some(json) => {
            let value = serde_json::from_str(&json)
                .map_err(|error| sqlx::Error::Decode(Box::new(error)))?;

            Ok(Some(value))
        }
        None => Ok(None),
    }
}

pub async fn set_setting(pool: &SqlitePool, key: &str, value: &Value) -> Result<(), sqlx::Error> {
    let json =
        serde_json::to_string(value).map_err(|error| sqlx::Error::Encode(Box::new(error)))?;

    sqlx::query(
        r#"
        INSERT INTO app_settings (key, value_json, updated_at)
        VALUES (?, ?, datetime('now'))
        ON CONFLICT(key)
        DO UPDATE SET
            value_json = excluded.value_json,
            updated_at = datetime('now')
        "#,
    )
    .bind(key)
    .bind(json)
    .execute(pool)
    .await?;

    Ok(())
}
