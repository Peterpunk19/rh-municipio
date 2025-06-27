This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

### Install

```bash
cp .env.dist .env
cp docker-compose.override.yml.dist docker-compose.override.yml
docker-compose build
docker-compose up
dcli yarn install
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