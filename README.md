## Description

This project above simulates the backend of a system of management of tasks and its respectives areas. 

## Clone
```bash
$ git@github.com:m4theuspereira-maker/stage-backend-test.git
```
## Enter in project folder and set PORT and DATABASE_URL into .env file

example:
```bash
  PORT=8080
  DATABASE_URL=localhost:21017
```

## Instalation and build dependencies
```bash
$ yarn
$ yarn build
```

## Running application
```bash
#development
$ yarn dev

#prod
$ yarn start

#docker compose
$ docker-compose up
```

## Running tests

```
$ yarn test
```
## Project organization
```
├─ .husky
│  ├─ _
│  │  ├─ .gitignore
│  │  └─ husky.sh
│  ├─ pre-commit
│  └─ pre-push
├─ .huskyrc.json
├─ prisma
│  └─ schema.prisma
├─ src
│  ├─ config
│  │  ├─ client
│  │  │  └─ client.ts
│  │  ├─ dotenv.ts
│  │  └─ environment-consts.ts
│  ├─ controllers
│  │  ├─ adapters
│  │  │  └─ handlers.ts
│  │  ├─ departament-controllers.ts
│  │  ├─ process-controller.ts
│  │  └─ subprocess-controllers.ts
│  ├─ domain
│  │  ├─ constants
│  │  │  └─ constants.ts
│  │  ├─ departament.ts
│  │  ├─ error
│  │  │  └─ erros.ts
│  │  ├─ interfaces
│  │  │  └─ interfaces.ts
│  │  └─ process.ts
│  ├─ factories
│  │  └─ factories.ts
│  ├─ index.ts
│  ├─ repositories
│  │  ├─ departament-repository.ts
│  │  ├─ interfaces
│  │  │  └─ repository.ts
│  │  ├─ process-repository.ts
│  │  └─ subprocess-repository.ts
│  ├─ routes.ts
│  ├─ services
│  │  ├─ departament-service.ts
│  │  ├─ process-service.ts
│  │  └─ subprocess-service.ts
│  └─ utils
│     └─ utils.ts
├─ tests
│  ├─ config
│  │  ├─ client.ts
│  │  └─ mock
│  │     └─ mocks.ts
│  ├─ controllers
│  │  ├─ departament-controller.e2e.spec.ts
│  │  └─ process-controller.2e2.spec.ts
│  ├─ domain
│  │  ├─ departament.spec.ts
│  │  └─ process.spec.ts
│  ├─ repositories
│  │  ├─ departament-repository.spec.ts
│  │  ├─ process-repository.spec.ts
│  │  └─ subprocess-repository.spec.ts
│  └─ services
│     ├─ departaments-services.spec.ts
│     ├─ process-service.spec.ts
│     └─ suprocess-services.spec.ts
├─ .eslintignore
├─ .eslintrc.json
├─ .gitignore
├─ tsconfig-build.json
├─ tsconfig.json
├─ .prettierrc.json
├─ Dockerfile
├─ docker-compose.yml
├─ jest.config.js
├─ nodemon.json
├─ package.json
├─ yarn-error.log
└─ yarn.lock
```