import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // aktifkan validasi DTO secara global
  app.useGlobalPipes(new ValidationPipe());

  // aktifkan CORS agar frontend bisa akses API
  app.enableCors();

  // =====================
  // SETUP SWAGGER
  // =====================
  const config = new DocumentBuilder()
    .setTitle('Lalapan Cak Bud API')
    .setDescription('Dokumentasi API untuk website kuliner Lalapan Cak Bud')
    .setVersion('1.0')
    .addBearerAuth()  // tambahkan tombol Authorize untuk JWT token
    .build();

  const document = SwaggerModule.createDocument(app, config);

  // Swagger bisa diakses di http://localhost:3000/api
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Server jalan di port ${port}`);
  console.log(`Swagger docs di port ${port}/api`);
}
bootstrap();