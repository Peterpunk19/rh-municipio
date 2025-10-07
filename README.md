This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Install

```bash
cp .env.dist .env
cp docker-compose.override.yml.dist docker-compose.override.yml
 docker compose build
dcu -d mysql
dcli yarn prisma generate
dcli yarn prisma migrate deploy
dcli yarn ts-node prisma/seed.ts --employees=20
docker-compose up nextjs
```

> `dcli` is an alias for `docker-compose -f docker-compose.cli.yml run --rm`

#### Run Dev

It will start mysql, adminer and nextjs

```bash
docker-compose up
```

If you prefer in background the dependencies:

```bash
docker-compose up -d mysql adminer
```

And only execute the api in console to see the operations

```bash
docker-compose up nextjs
```

## Configuration PRISMA ORM

Instalamos las dependencies del proyecto y las necesarias de PRISMA que se encuentran en el archivo de package.json

```bash
yarn install
```

Aplicar las migraciones directamente para crear la estructura de la base de datos:

```bash
dcli yarn prisma migrate dev --name init
dcli yarn prisma migrate deploy
```

### Run Seeds

```bash
dcli yarn ts-node prisma/seed.ts

User admin will be created
admin:Password123
```
### To rollback a seed in Prisma
```bash
dcli yarn tsc prisma/rollback-seed.ts
dcli yarn prisma/rollback-seed.js
```

### Create migration
```bash
dcli yarn prisma migrate dev --name <migration-name>
dcli yarn prisma migrate deploy
```

### To rollback a migration
```bash
dcli yarn prisma migrate reset
```

## Commands

Run tests

```bash
dcli yarn test
dcli yarn test --runInBand
```

Run Fix Format

```bash
dcli yarn fix
```

## Access Services

Next.js: Visit http://localhost:3001 to see your Next.js app.

Adminer: Visit http://localhost:8081 to interact with the MySQL database.

MySQL: Connect to MySQL on port 3307 using the credentials specified in your .env file.

## Import employees for testing

```bash
Call as POST request http://localhost:3001/api/employees/import (check body insomnia)
```

## Deploy to production

### Install

```bash
docker buildx build \
  --platform linux/amd64 \
  -t us-central1-docker.pkg.dev/metal-force-473618-p6/rhadmin/rhadmin:latest \
  --load .
  
docker push us-central1-docker.pkg.dev/metal-force-473618-p6/rhadmin/rhadmin:latest

gcloud run deploy rhadmin \
  --image us-central1-docker.pkg.dev/metal-force-473618-p6/rhadmin/rhadmin:latest \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --timeout=600s \
  --set-env-vars NODE_ENV=production,HOST=0.0.0.0,\
NEXT_PUBLIC_BASE_URL=https://rhadmin-1005155783559.us-central1.run.app,\
NEXT_PUBLIC_API_URL=https://rhadmin-1005155783559.us-central1.run.app/api,\
NEXT_PUBLIC_BASE_API_AUTH=https://rhadmin-1005155783559.us-central1.run.app/api/authentication,\
NEXTAUTH_URL=https://rhadmin-1005155783559.us-central1.run.app,\
NEXTAUTH_SECRET=llXfTO6YPwUg4/1wNMTNkpy96KsYZqiI67CHKpYoE9I=,\
DB_ENABLED=true,DB_TYPE=mysql,DB_USER=admin,DB_PASSWORD=zPX5mf3e63BM,\
DB_DATABASE=rh_municipio_db,DB_HOST=35.208.222.57,DB_PORT=3306,\
DATABASE_URL=mysql://admin:zPX5mf3e63BM@35.208.222.57:3306/rh_municipio_db,\
DATABASE_URL_NON_POOLING=mysql://admin:zPX5mf3e63BM@35.208.222.57:3306/rh_municipio_db,\
JWT_ENABLED=true,JWT_SECRET_KEY=eYn1y9ZAjhzhCkfb77gx,JWT_ALGORITHM=HS512,\
JWT_ISSUER=guardbuildinginvestments.com,JWT_ACCESS_EXPIRES_IN=1h,JWT_REFRESH_EXPIRES_IN=2h
```

> `dcli` is an alias for `docker-compose -f docker-compose.cli.yml run --rm`

#### Run Dev

It will start mysql, adminer and nextjs

```bash
docker-compose up
```