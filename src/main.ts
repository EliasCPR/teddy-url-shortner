import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PORT } from './infrastructure/enviroments/env';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Url Shortner')
    .setDescription('simple api shortner url')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
}
bootstrap();
