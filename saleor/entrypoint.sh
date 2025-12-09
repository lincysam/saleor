#!/bin/bash
set -e

echo "Waiting for database..."
sleep 15

echo "Running migrations..."
python manage.py migrate

echo "Collecting static files..."
python manage.py collectstatic --noinput

# Create tenants with error handling (continue even if they exist)
echo "Setting up vendor1 tenant..."
if ! python manage.py create_custom_tenant vendor1 vendor1.localhost "Vendor1" 2>/dev/null; then
    echo "Note: Tenant vendor1 already exists"
fi

echo "Setting up vendor2 tenant..."
if ! python manage.py create_custom_tenant vendor2 vendor2.localhost "Vendor2" 2>/dev/null; then
    echo "Note: Tenant vendor2 already exists"
fi

echo "Starting Saleor server..."
exec python manage.py runserver 0.0.0.0:8000