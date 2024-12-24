#!/bin/bash

# First test Ollama connection if URL is provided
# if [ -f "test_ollama.sh" ]; then
#     chmod +x test_ollama.sh 
#     ./test_ollama.sh
# fi

# set -e 
# mkdir -p /pyspur/app/models/management/alembic/versions/versions
# check_for_changes() {
#     alembic check
# }

#!/bin/bash

# Activate virtual environment if it exists
if [ -d "venv" ]; then
    source venv/bin/activate
fi

export PYTHONPATH="${PYTHONPATH}:${PWD}"

# Create SQLite directory if it doesn't exist
mkdir -p sqlite

# Initialize alembic if not already initialized
if [ ! -f "alembic.ini" ]; then
    alembic init migrations
fi

set -e 
# mkdir -p ./app/models/management/alembic/versions/versions
mkdir -p /pyspur/app/models/management/alembic/versions/versions
check_for_changes() {
    alembic -c alembic.ini check || return 1
}

create_revision_and_upgrade() {
    echo "New changes detected, creating revision and running upgrade."
    alembic -c alembic.ini revision --autogenerate -m "Auto-generated revision"
    alembic -c alembic.ini upgrade head
}

start_server() {
    uvicorn app.api.main:app --reload --host 0.0.0.0 --port 8000
}
reset_database() {
    echo "Resetting database and migrations..."
    rm -f sqlite/test.db
    rm -rf migrations/versions/*
    alembic init migrations
    alembic -c alembic.ini revision --autogenerate -m "Initial migration"
    alembic -c alembic.ini upgrade head
}
main() {
    # Check for reset flag
    if [ "$1" = "--reset" ]; then
        reset_database
    else
        # Initialize database if it doesn't exist
        if [ ! -f "sqlite/test.db" ]; then
            alembic -c alembic.ini upgrade head
        fi
        
        if check_for_changes; then
            echo "No changes detected, skipping revision creation and upgrade."
        else
            create_revision_and_upgrade
        fi
    fi
    start_server
}

main