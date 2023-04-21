
 <h1 align="center">API_BackEnd</h1>

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

## Description

Application on NestJS(Postgres, Sequelize, RabbitMQ, Docker) for films with registration and authorization 

</br>

## Documentation for endpoints
<h3>Home <a href="http://localhost:4000/" target="blank">localhost:4000</a> - home page, check if the server is running</h3>
<h3>Docs <a href="http://localhost:4000/api/docs" target="blank">localhost:4000/api/docs</a> - detailed documentation</h3>
<h3>RabbitMQ <a href="http://localhost:15672/" target="blank">localhost:15672</a> - rabbitMQ manager</h3>
<h3>PgAdmin <a href="http://localhost:15432/" target="blank">localhost:15432</a> - Postgres Admin</h3>

</br>

## Downloading

```bash
git clone https://github.com/GoldenManBel/API_BackEnd.git
```

## Installing NPM modules

```bash
npm install
```

## Running application in docker

```bash
docker compose up --build
```

## Testing

```bash
# e2e tests
npm run test:e2e
```

## Auto-fix and format

```bash
npm run lint
```
