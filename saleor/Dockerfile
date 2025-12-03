FROM python:3.12 AS build-python

RUN apt-get update && apt-get install -y \
    gettext \
    libjpeg-dev \
    zlib1g-dev \
    libfreetype6-dev \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency files only for caching
COPY pyproject.toml poetry.lock* /app/

# Install Poetry and dependencies
RUN pip install --upgrade pip setuptools wheel poetry \
    && poetry config virtualenvs.create false \
    && poetry install --without dev --no-root --no-interaction --no-ansi


# -------------------------
# Final runtime image
# -------------------------
FROM python:3.12-slim

RUN groupadd -r saleor && useradd -r -g saleor saleor

# Install runtime libs for Pillow + required libs for Saleor
RUN apt-get update && apt-get install -y \
    libjpeg62-turbo \
    libjpeg-dev \
    zlib1g \
    zlib1g-dev \
    libfreetype6 \
    liblcms2-2 \
    libopenjp2-7 \
    libtiff6 \
    libwebp7 \
    libpq5 \
    libmagic1 \
    libcurl4 \
    media-types \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN mkdir -p /app/media /app/static \
    && chown -R saleor:saleor /app/

# Copy installed dependencies from build stage
COPY --from=build-python /usr/local/lib/python3.12/site-packages/ /usr/local/lib/python3.12/site-packages/
COPY --from=build-python /usr/local/bin/ /usr/local/bin/

# Copy application code
COPY . /app
WORKDIR /app

ENV SOFT_MEMORY_LIMIT_IN_MB=2048
ENV HARD_MEMORY_LIMIT_IN_MB=3500

# Collect static files
ARG STATIC_URL
ENV STATIC_URL=${STATIC_URL:-/static/}
RUN SECRET_KEY=dummy STATIC_URL=${STATIC_URL} python manage.py collectstatic --noinput

# Entrypoint
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER saleor
EXPOSE 8000

CMD ["/entrypoint.sh"]
