# nestjs-ocr-server


## Description
An OCR server written in NestJS with Typescript and uses OCRSpace for the API.

## Project setup

```bash
$ npm install
```

## Configuration

```bash
$ cp .env.example .env
```

Provide the values for the ENV variables:
```bash
OCR_API_URL=
OCR_API_KEY=
PORT=
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## Run tests

```bash
# unit tests
$ npm run test

```

## Endpoint

``
POST: /ocr/process
``
#### accepts a file with following validations:
 - only accepts ``png, jpeg, and pdf files``
 - maximum size is ``1MB``




