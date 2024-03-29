 <h1 align="center">API_BackEnd</h1>

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

An application built with NestJS and microservices (PostgreSQL, Sequelize, RabbitMQ, Docker) for movies, including registration and authentication

</br>

## Documentation for endpoints

<h3>Home <a href="http://localhost:4000/" target="blank">localhost:4000</a> - home page, check if the server is running</h3>
<h3>Docs <a href="http://localhost:4000/api/docs" target="blank">localhost:4000/api/docs</a> - detailed documentation</h3>

</br>

## PgAdmin and RabbitMQ managers

<h3>PgAdmin <a href="http://localhost:15432/" target="blank">localhost:15432</a> - Postgres Admin</h3>
<h3>RabbitMQ <a href="http://localhost:15672/" target="blank">localhost:15672</a> - rabbitMQ manager</h3>

</br>

## Downloading

```bash
git clone https://github.com/AlexanderYovzhenko/API_BackEnd.git
```

## Running application in docker

```bash
docker compose up --build
```

## Restore database

```bash
docker cp ./backend.dump postgres:/backend.dump
```

```bash
docker exec -i -t postgres sh
```

```bash
pg_restore -U postgres -d backend --clean backend.dump
```

```bash
exit
```

## Installing NPM modules

```bash
npm install
```

## Testing

```bash
npm run test
```

```bash
npm run test:detail
```

```bash
npm run test:cov
```

```bash
npm run test:e2e
```

## Auto-fix and format

```bash
npm run lint
```

## Added admin role to admin user (Добавлена роль admin пользователю admin)

```bash
# login
{
  "email": "admin@gmail.com",
  "password": "admin"
}
```

## Scheme tables

![scheme tables](https://github.com/AlexanderYovzhenko/API_BackEnd/blob/master/diagram/Scheme_Tables.jpg)
