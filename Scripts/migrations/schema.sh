#!/usr/bin/env bash
# schema.sh — unified database helper for RevenueAI
# Location: Scripts/migrations/schema.sh
# Handles both:
#   - baseline schema: EVERY .sql file placed in Scripts/deployement/database/
#     is treated as direct, unversioned table creation.
#   - versioned migrations (indexes, views, functions, from Scripts/migrations/)
#
# Run with: bash schema.sh <command> [args]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../deployement/.env"
MIGRATIONS_DIR="$SCRIPT_DIR"
DATABASE_DIR="$SCRIPT_DIR/../deployement/src/database"

if [ -f "$ENV_FILE" ]; then
  export $(grep -v '^#' "$ENV_FILE" | xargs)
else
  echo "Error: .env not found at $ENV_FILE"
  exit 1
fi

if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL is not set. Check $ENV_FILE"
  exit 1
fi

case "$1" in
  init-db)
    # Applies EVERY .sql file found directly inside Scripts/deployement/database/,
    # in alphabetical order. Any file dropped in that folder — schema.sql,
    # register.sql, products.sql, whatever — gets picked up automatically.
    # Use numeric prefixes (01_, 02_...) if creation order matters
    # (e.g. a table with a foreign key must come after the table it references).
    shopt -s nullglob
    sql_files=("$DATABASE_DIR"/*.sql)
    shopt -u nullglob

    if [ ${#sql_files[@]} -eq 0 ]; then
      echo "Error: no .sql files found in $DATABASE_DIR"
      exit 1
    fi

    for f in $(printf '%s\n' "${sql_files[@]}" | sort); do
      echo "Applying $f..."
      psql "$DATABASE_URL" -f "$f"
    done
    echo "Done."
    ;;

  new)
    if [ -z "$2" ]; then
      echo "Usage: ./schema.sh new <migration_name>"
      exit 1
    fi
    sqlx migrate add -r "$2" --source "$MIGRATIONS_DIR"
    echo "Created migration files for '$2' in $MIGRATIONS_DIR/"
    ;;

  migrate)
    sqlx migrate run --source "$MIGRATIONS_DIR"
    ;;

  revert)
    sqlx migrate revert --source "$MIGRATIONS_DIR"
    ;;

  info)
    sqlx migrate info --source "$MIGRATIONS_DIR"
    ;;

  create-db)
    sqlx database create
    ;;

  drop-db)
    sqlx database drop
    ;;

  reset)
    sqlx database drop -y
    sqlx database create
    shopt -s nullglob
    sql_files=("$DATABASE_DIR"/*.sql)
    shopt -u nullglob
    for f in $(printf '%s\n' "${sql_files[@]}" | sort); do
      echo "Applying $f..."
      psql "$DATABASE_URL" -f "$f"
    done
    sqlx migrate run --source "$MIGRATIONS_DIR"
    ;;

  *)
    echo "Usage: ./schema.sh {init-db|new|migrate|revert|info|create-db|drop-db|reset}"
    echo ""
    echo "  init-db          Apply every .sql file in Scripts/deployement/database/ directly (fresh DB only)"
    echo "  new <name>       Create a new versioned migration (up/down pair)"
    echo "  migrate          Apply all pending migrations"
    echo "  revert           Revert the last applied migration"
    echo "  info             Show migration status"
    echo "  create-db        Create the database"
    echo "  drop-db          Drop the database"
    echo "  reset            Drop, recreate DB, apply all database/*.sql, then migrate"
    exit 1
    ;;
esac