FROM python:3.12-slim



# Configuraciones para que Python corra fluido en Docker
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Instalamos herramientas de sistema básicas Y dependencias para OCR (Tesseract y Poppler)
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    tesseract-ocr \
    tesseract-ocr-spa \
    poppler-utils \
    && rm -rf /var/lib/apt/lists/*

# Copiamos solo los requirements primero para aprovechar la caché de Docker
COPY requirements/ /app/requirements/
RUN pip install --upgrade pip
RUN pip install -r requirements/development.txt

# El código se monta mediante volumen en docker-compose
