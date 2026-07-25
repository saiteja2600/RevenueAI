use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Serialize)]
pub struct User {
    pub id: Uuid,
    pub work_email: String,
    pub full_name: String,
    pub company_name: String,
}

#[derive(Debug, Deserialize)]
pub struct RegisterRequest {
    pub full_name: String,
    pub company_name: String,
    pub work_email: String,
    pub password: String,
}

#[derive(Debug, Deserialize)]
pub struct LoginRequest {
    pub work_email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub user: User,
}

#[derive(Debug, Serialize)]
pub struct ErrorResponse {
    pub error: String,
}