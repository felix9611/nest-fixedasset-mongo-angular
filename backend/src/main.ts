import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.enableCors({
    origin: '*',  // ✅ Allow all origins (or specify frontend URL)
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type,Authorization'
  })
 // app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  await app.listen(process.env.PORT ?? 7350)
}
bootstrap();
