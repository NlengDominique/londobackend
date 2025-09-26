/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend communication
  app.enableCors({
    origin: ['http://localhost:4200'],
    credentials: true,
  });
  

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter())
  

  app.setGlobalPrefix('api');

  const config = new DocumentBuilder()
    .setTitle('Plantify API')
    .setDescription('API de gestion de plantes')
    .setVersion('1.0')
    .addTag('auth', 'Authentification')
    .addTag('plantes', 'Gestion des plantes')
    .addTag('arrosages', 'Gestion des arrosages')
    .addTag('notifications', 'Gestion des notifications et rappels')
    .addTag('rappels', 'Gestion des rappels')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);
  
  const port = process.env.PORT ?? 3000;
  console.log(`Application running on port ${port}`);
  console.log(`Documentation API disponible sur http://localhost:${port}/api-docs`);
  await app.listen(port);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
