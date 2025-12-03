# #!/bin/bash
# set -e

# echo "🚀 Waiting for Redis (if used)..."
# # optional: add wait-for-db logic here if needed

# echo "🔹 Running shared migrations..."
# poetry run python manage.py migrate_schemas --shared

# echo "🔹 Running tenant migrations..."
# poetry run python manage.py migrate_schemas

# echo "🔹 Collecting static files..."
# poetry run python manage.py collectstatic --noinput

# echo "🎯 Starting backend..."
# poetry run uvicorn saleor.asgi:application --host 0.0.0.0 --port 8000


#!/bin/bash
set -e

echo "🚀 Waiting for Postgres..."
while ! nc -z db 5432; do
  sleep 1
done

echo "🚀 Waiting for Redis..."
while ! nc -z saleor-redis 6379; do
  sleep 1
done

echo "🔹 Running shared migrations..."
poetry run python manage.py migrate_schemas --shared

echo "🔹 Running tenant migrations..."
poetry run python manage.py migrate_schemas

echo "🔹 Collecting static files..."
poetry run python manage.py collectstatic --noinput

create_tenant() {
  SCHEMA=$1
  DOMAIN=$2
  NAME=$3

  echo "👉 Checking tenant: $SCHEMA"

  EXISTS=$(poetry run python manage.py shell -c \
    "from tenants.models import Tenant; print(Tenant.objects.filter(schema_name='$SCHEMA').exists())")

  if [ "$EXISTS" = "False" ]; then
      echo "➡️ Creating tenant: $SCHEMA"
      poetry run python manage.py create_custom_tenant "$SCHEMA" "$DOMAIN" "$NAME"
  else
      echo "✔ Tenant '$SCHEMA' already exists. Skipping."
  fi
}

echo "🏗 Creating Vendor Tenants..."
create_tenant "vendor1" "vendor1.localhost" "Vendor 1"
create_tenant "vendor2" "vendor2.localhost" "Vendor 2"
create_tenant "vendor3" "vendor3.localhost" "Vendor 3"


##############################################


echo "🎯 Starting backend..."
exec poetry run uvicorn saleor.asgi:application --host 0.0.0.0 --port 8000
