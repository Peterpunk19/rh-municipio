This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
cp .env.dist .env
cp docker-compose.override.yml.dist docker-compose.override.yml
docker-compose build
docker-compose up
```

#### Run Dev

It will start api, mysql, adminer and nextjs

```bash
docker-compose up -d
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
npx prisma migrate deploy
```

Ejecuta el proyecto con la base de datos configurada

```bash
npm run dev
```

## Access Services

Next.js: Visit http://localhost:3001 to see your Next.js app.

Adminer: Visit http://localhost:8081 to interact with the MySQL database.

MySQL: Connect to MySQL on port 3307 using the credentials specified in your .env file.
