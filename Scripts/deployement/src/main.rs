mod auth;
mod connection;
mod models;

use axum::{routing::post, Router};
use sqlx::PgPool;
use std::net::SocketAddr;

#[derive(Clone)]
pub struct AppState {
    pub pool: PgPool,
}

#[tokio::main]
async fn main() -> Result<(), sqlx::Error> {
    dotenvy::dotenv().ok(); // loads .env if present

    let pool = connection::create_pool().await?;
    let state = AppState { pool };

    let app = Router::new()
        .route("/api/register", post(auth::register))
        .route("/api/login", post(auth::login))
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], 8080));
    println!("Listening on http://{addr}");

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();

    Ok(())
}