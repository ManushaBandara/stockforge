pub mod connection;

pub use connection::create_pool;

use sqlx::SqlitePool;

pub struct DbState {
    pub pool: SqlitePool,
}
