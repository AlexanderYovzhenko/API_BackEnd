import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        dialect: await configService.get('DB_DIALECT'),
        host: await configService.get('POSTGRES_HOST'),
        port: await configService.get('POSTGRES_PORT'),
        username: await configService.get('POSTGRES_USER'),
        password: await configService.get('POSTGRES_PASSWORD'),
        database: await configService.get('POSTGRES_DB'),
        autoLoadModels: true,
        synchronize: true,
      }),
    }),
  ],
})
export class PostgresDBModule {}
