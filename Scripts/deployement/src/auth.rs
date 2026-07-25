use argon2::{
    password_hash::{PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use axum::{extract::State, http::StatusCode, Json};
use jsonwebtoken::{encode, EncodingKey, Header};
use rand_core::OsRng;
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::models::{AuthResponse, ErrorResponse, LoginRequest, RegisterRequest, User};
use crate::AppState;

#[derive(Debug, Serialize, Deserialize)]
struct Claims {
    sub: String, // user id
    exp: usize,
}

fn jwt_secret() -> String {
    std::env::var("JWT_SECRET").expect("JWT_SECRET must be set")
}

fn issue_token(user_id: Uuid) -> Result<String, jsonwebtoken::errors::Error> {
    let expiration = chrono::Utc::now()
        .checked_add_signed(chrono::Duration::hours(24))
        .expect("valid timestamp")
        .timestamp() as usize;

    let claims = Claims {
        sub: user_id.to_string(),
        exp: expiration,
    };

    encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(jwt_secret().as_bytes()),
    )
}

pub async fn register(
    State(state): State<AppState>,
    Json(payload): Json<RegisterRequest>,
) -> Result<Json<AuthResponse>, (StatusCode, Json<ErrorResponse>)> {
    // Hash the password
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();
    let password_hash = argon2
        .hash_password(payload.password.as_bytes(), &salt)
        .map_err(|_| {
            (
                StatusCode::INTERNAL_SERVER_ERROR,
                Json(ErrorResponse {
                    error: "Failed to hash password".into(),
                }),
            )
        })?
        .to_string();

    // Insert user — columns: full_name, company_name, work_email, password_hash
    let rec = sqlx::query_as::<_, (Uuid, String, String, String)>(
        r#"
        INSERT INTO register (full_name, company_name, work_email, password_hash)
        VALUES ($1, $2, $3, $4)
        RETURNING id, work_email, full_name, company_name
        "#,
    )
    .bind(&payload.full_name)
    .bind(&payload.company_name)
    .bind(&payload.work_email)
    .bind(&password_hash)
    .fetch_one(&state.pool)
    .await
    .map_err(|e| {
        let msg = if e.to_string().contains("unique") {
            "Email already registered"
        } else {
            "Failed to create user"
        };
        (
            StatusCode::BAD_REQUEST,
            Json(ErrorResponse { error: msg.into() }),
        )
    })?;

    let (id, work_email, full_name, company_name) = rec;

    let token = issue_token(id).map_err(|_| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(ErrorResponse {
                error: "Failed to issue token".into(),
            }),
        )
    })?;

    Ok(Json(AuthResponse {
        token,
        user: User {
            id,
            work_email,
            full_name,
            company_name,
        },
    }))
}

pub async fn login(
    State(state): State<AppState>,
    Json(payload): Json<LoginRequest>,
) -> Result<Json<AuthResponse>, (StatusCode, Json<ErrorResponse>)> {
    let rec = sqlx::query_as::<_, (Uuid, String, String, String, String)>(
        r#"
        SELECT id, work_email, full_name, company_name, password_hash
        FROM register
        WHERE work_email = $1
        "#,
    )
    .bind(&payload.work_email)
    .fetch_optional(&state.pool)
    .await
    .map_err(|_| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(ErrorResponse {
                error: "Database error".into(),
            }),
        )
    })?;

    let (id, work_email, full_name, company_name, password_hash) = rec.ok_or((
        StatusCode::UNAUTHORIZED,
        Json(ErrorResponse {
            error: "Invalid email or password".into(),
        }),
    ))?;

    let parsed_hash = PasswordHash::new(&password_hash).map_err(|_| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(ErrorResponse {
                error: "Corrupt password hash".into(),
            }),
        )
    })?;

    Argon2::default()
        .verify_password(payload.password.as_bytes(), &parsed_hash)
        .map_err(|_| {
            (
                StatusCode::UNAUTHORIZED,
                Json(ErrorResponse {
                    error: "Invalid email or password".into(),
                }),
            )
        })?;

    let token = issue_token(id).map_err(|_| {
        (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(ErrorResponse {
                error: "Failed to issue token".into(),
            }),
        )
    })?;

    Ok(Json(AuthResponse {
        token,
        user: User {
            id,
            work_email,
            full_name,
            company_name,
        },
    }))
}