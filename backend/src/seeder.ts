import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder/seeder.module';
import { SeederService } from './seeder/seeder.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule); // Crear un contexto de aplicación sin iniciar un servidor HTTP
  const seeder = app.get(SeederService);
  await seeder.seed();
  await app.close(); // Cerrar la aplicación después de ejecutar el seeder
}
bootstrap();
