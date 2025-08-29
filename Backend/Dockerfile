FROM python:3.11-slim

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        postgresql-client \
        build-essential \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

RUN echo '#!/bin/bash\n\
set -e\n\
echo "Waiting for postgres..."\n\
while ! pg_isready -h db -p 5432 -U starwars_user; do\n\
  sleep 1\n\
done\n\
echo "PostgreSQL started"\n\
python manage.py migrate\n\
python manage.py collectstatic --noinput || true\n\
python manage.py populate_data || echo "Data population skipped"\n\
exec "$@"' > /entrypoint.sh && chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]