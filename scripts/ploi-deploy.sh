cd {SITE_DIRECTORY}

# Create .env if not present
if [ ! -f .env ] && [ -f .env.production.example ]; then
  cp .env.production.example .env
fi

# Pull changes
git pull origin main

# Install composer dependencies
composer install --no-interaction --prefer-dist --optimize-autoloader --no-dev

{RELOAD_PHP_FPM}

# Build frontend assets
if [ -f package-lock.json ]; then
  npm install
elif [ -f pnpm-lock.yaml ]; then
  npx pnpm i --store=node_modules/.pnpm-store && npx pnpm run build
fi

# Clean cache
rm -rf storage/cache/{DOMAIN}

echo "🚀 Application deployed!"
