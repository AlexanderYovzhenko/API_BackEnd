import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostgresDBModule, SharedModule, SharedService } from '@app/shared';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    SharedModule,
    PostgresDBModule,
    SequelizeModule.forFeature([]),
    JwtModule.register({
      secret: process.env.JWT_SECRET_KEY,
      signOptions: {
        expiresIn: '24h',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService,
    },
  ],
})
export class AuthModule {}
