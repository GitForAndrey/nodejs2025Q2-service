
# Home Library Service

## Prerequisites

- Git - [Download & Install Git](https://git-scm.com/downloads).
- Node.js - [Download & Install Node.js](https://nodejs.org/en/download/) and the npm package manager.

## Downloading

```
git clone https://github.com/GitForAndrey/nodejs2025Q2-service/tree/develop3
```

## Install PostgresQL & Docker

PostgresQL: https://www.postgresql.org/

Docker: https://hub.docker.com/

## Installing NPM modules
```
npm install
```
First of all you need to create a `.env` file. Copy from .env.example

## Running application using Docker with PostgreSQL database

Run this command and wait

```
docker compose build
docker-compose up

```
To run test, run
```
npm run test:auth
```
If you want to reset the database:
```
npx prisma migrate reset --force
```
