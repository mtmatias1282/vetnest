import { Module } from '@nestjs/common';
import { SeederService } from './seeder.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from '../config/typeorm.config';
import { Product } from '../products/entities/product.entity';
import { Category } from '../categories/entities/category.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      //hace el acceso de las variables de entorno globalmente
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      //configuracion de la base de datos, asincrono porque hay que esperar la respuesta del servidor
      useFactory: typeOrmConfig,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Product, Category])
  ],
  providers: [SeederService],
})
export class SeederModule {}
