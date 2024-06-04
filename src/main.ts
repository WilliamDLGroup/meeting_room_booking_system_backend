import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './format-response.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CustomExceptionFilter } from './custom-exception.filter';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const config = app.get(ConfigService);

    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalInterceptors(new FormatResponseInterceptor());
    app.useGlobalFilters(new CustomExceptionFilter());
    const swaggerConfig = new DocumentBuilder()
      .setTitle('会议室预订系统')
      .setDescription('api 接口文档')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api-doc', app, document);
    app.enableCors();

    await app.listen(config.get('nest_server_port'));
  } catch (error) {
    console.error('Error starting the application', error);
  }
}
bootstrap();
