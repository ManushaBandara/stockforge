use keyring::Entry;

const SERVICE_NAME: &str = "com.stockforge.desktop";
const GEMINI_API_KEY: &str = "gemini-api-key";

pub fn save_gemini_api_key(api_key: &str) -> Result<(), String> {
    let api_key = api_key.trim();

    if api_key.is_empty() {
        return Err("Gemini API key cannot be empty".to_string());
    }

    let entry = Entry::new(SERVICE_NAME, GEMINI_API_KEY).map_err(|error| error.to_string())?;

    entry
        .set_password(api_key)
        .map_err(|error| error.to_string())
}

pub fn get_gemini_api_key() -> Result<String, String> {
    let entry = Entry::new(SERVICE_NAME, GEMINI_API_KEY).map_err(|error| error.to_string())?;

    entry.get_password().map_err(|error| error.to_string())
}

pub fn has_gemini_api_key() -> Result<bool, String> {
    let entry = Entry::new(SERVICE_NAME, GEMINI_API_KEY).map_err(|error| error.to_string())?;

    match entry.get_password() {
        Ok(_) => Ok(true),
        Err(keyring::Error::NoEntry) => Ok(false),
        Err(error) => Err(error.to_string()),
    }
}

pub fn delete_gemini_api_key() -> Result<(), String> {
    let entry = Entry::new(SERVICE_NAME, GEMINI_API_KEY).map_err(|error| error.to_string())?;

    match entry.delete_credential() {
        Ok(()) => Ok(()),
        Err(keyring::Error::NoEntry) => Ok(()),
        Err(error) => Err(error.to_string()),
    }
}
