
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
## Running application localy

First of all you need to create a `.env` file. Copy from .env.example

Then you need to create a new PostgresQL database. Be shure that PostgresQL installed on your machine.

Execute this command to create a new database

```
npx prisma generate

```
```
npm run start:dev
```

## Running application using Docker with PostgreSQL database

Run this command and wait

```

docker-compose up

```

## Scan for vulnerabilities

Since docker scan is deprecated, docker scout is used for vulnerabilities scanning.
