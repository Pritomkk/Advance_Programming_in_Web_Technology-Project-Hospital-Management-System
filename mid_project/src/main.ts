import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  // Configure session
  app.use(
    session({
      secret: 'Hello',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3000000
      }
    })
  );

  // Configure bodyParser for handling form data
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  // Enable CORS
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Enable global validation pipe
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3000);
}
bootstrap();
