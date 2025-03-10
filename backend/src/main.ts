import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as mongoose from 'mongoose'
import * as bodyParser from 'body-parser'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: ['log', 'error', 'warn', 'debug'] })
  app.enableCors({
    origin: '*',  // ✅ Allow all origins (or specify frontend URL)
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type,Authorization'
  })
  mongoose.set('debug', true);
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))
 // app.useGlobalPipes(new ValidationPipe({ whitelist: true }))
  await app.listen(process.env.PORT ?? 7350)
}
bootstrap();
