set -e
echo "Running Prisma migrations..."
npx prisma migrate deploy --schema=src/prisma/schema.prisma
echo "Starting SafePay backend..."
exec node src/index.js