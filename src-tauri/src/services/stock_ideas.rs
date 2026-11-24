use crate::{
    errors::AppResult,
    models::stock_idea::{CreateStockIdeaInput, StockIdea},
};
use sqlx::{Row, SqlitePool};
use uuid::Uuid;

pub async fn create_stock_idea(
    pool: &SqlitePool,
    input: CreateStockIdeaInput,
) -> AppResult<StockIdea> {
    let id = Uuid::new_v4().to_string();

    sqlx::query(
        r#"
        INSERT INTO stock_ideas (
            id, name, category, trend_research_json,
            image_prompt, title, description,
            keywords_json, full_json, created_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,
            strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
        "#,
    )
    .bind(&id)
    .bind(&input.name)
    .bind(&input.category)
    .bind(&input.trend_research_json)
    .bind(&input.image_prompt)
    .bind(&input.title)
    .bind(&input.description)
    .bind(&input.keywords_json)
    .bind(&input.full_json)
    .execute(pool)
    .await?;

    get_stock_idea_by_id(pool, &id).await
}

async fn get_stock_idea_by_id(
    pool: &SqlitePool,
    id: &str,
) -> AppResult<StockIdea> {
    let row = sqlx::query("SELECT * FROM stock_ideas WHERE id = ?")
        .bind(id)
        .fetch_one(pool)
        .await?;

    Ok(StockIdea {
        id: row.try_get("id")?,
        name: row.try_get("name")?,
        category: row.try_get("category")?,
        trend_research_json: row.try_get("trend_research_json")?,
        image_prompt: row.try_get("image_prompt")?,
        title: row.try_get("title")?,
        description: row.try_get("description")?,
        keywords_json: row.try_get("keywords_json")?,
        full_json: row.try_get("full_json")?,
        created_at: row.try_get("created_at")?,
    })
}

pub async fn get_stock_ideas(
    pool: &SqlitePool,
) -> AppResult<Vec<StockIdea>> {
    let rows = sqlx::query(
        "SELECT * FROM stock_ideas ORDER BY created_at DESC"
    )
    .fetch_all(pool)
    .await?;

    rows.into_iter()
        .map(|row| {
            Ok(StockIdea {
                id: row.try_get("id")?,
                name: row.try_get("name")?,
                category: row.try_get("category")?,
                trend_research_json: row.try_get("trend_research_json")?,
                image_prompt: row.try_get("image_prompt")?,
                title: row.try_get("title")?,
                description: row.try_get("description")?,
                keywords_json: row.try_get("keywords_json")?,
                full_json: row.try_get("full_json")?,
                created_at: row.try_get("created_at")?,
            })
        })
        .collect::<Result<Vec<StockIdea>, sqlx::Error>>()
        .map_err(Into::into)
}
