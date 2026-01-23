import type {TypeOrmModuleOptions} from "@nestjs/typeorm";
import {ConfigService} from "@nestjs/config";

export const typeOrmConfig = (configService:|ConfigService): TypeOrmModuleOptions => ({
    type: 'postgres',
    host: configService.get('DATABASE_HOST'),
    port: configService.get('DATABASE_PORT'),
    username: configService.get('DATABASE_USER'),
    ssl:true
}); //con parentesis para retornar un objeto literal
