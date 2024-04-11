# CLINIC_MANAGEMENT_SYSTEM SERVICE

This service is the clinic management service.

## Getting Started

These instructions will get you a copy of the clinic managemnet service up and running on your local machine for development and testing purposes.

## How to run on local machine?

You can run this service on your local machine in two ways.

1. By simply updating the configuration values in .env.local file
2. By using [dotenv](https://www.npmjs.com/package/dotenv) npm module. Just create .env file in root directory of the code. Add all the env variables which are given below with the values.

export NODE_ENV=local && npm run start:dev

## How to lint?

We use airbnb standard for linting.

```
npm run lint

```

### Environment Variables

These are the environment variables to be provided while docker run or local run.
To run the service locally using environment variables we need to create .env file in root directory of the code.
To run this service using docker we need to pass env variables while creating the docker container.
Following are the env varibales used in the service.

```
TYPE=postgres,
HOST=localhost,
PORT=5432,
USERNAME=admin,
PASSWORD=admin,
DATABASE=clinic_db

```

### Installing

A step by step series of examples that tell you how to get a development env running

Say what the step will be

```
npm i
```

```
export NODE_ENV=development && npm run start:dev
```

End with an example of getting some data out of the system or using it for a little demo


## API Documentation

### PATIENT MODULE

| Method | Url           | Description                 | 
| ------ | ------------- | --------------------------- |
| POST   | `/patients`     | register patient   |
| GET    | `/patients/:id` | get patient by patient id      |
| DELETE | `/patients/:id` | delete patient by patient id    |

### DOCTOR MODULE

| Method | Url               | Description                        |
| ------ | ----------------- | ---------------------------------- |
| POST   | `/doctors`      | create doctor       |
| GET    | `/doctors/:id`  | get doctor by doctor id       |
| PATCH  | `/doctors/:id`  | update doctor by doctor id     |
| DELETE | `/doctors/:id`  | delete doctor by doctor id     |

### APPOINTMENT MODULE

| Method | Url               | Description                        |
| ------ | ----------------- | ---------------------------------- |
| POST   | `/appointments`      | book appointment       |
| PATCH  | `/appointments/:id`  | update appointment by appointment id     |
| DELETE | `/appointments/:id`  | delete appointment by appointment id     |
| GET | `doctor/:doctorId/date/:date`  | list appointment for doctor on date  |
| GET | `doctor/:doctorId/available-slots`  |get available slots for a doctor on given date      |


## Authors

-   **Nandini Tuptewar** - _Initial work_

## License

This microservice is licensed under the free License - see the [LICENSE.md](LICENSE.md) file for details
