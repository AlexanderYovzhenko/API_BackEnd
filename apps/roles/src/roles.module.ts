import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role, UserRole } from './entities';
import {
  PostgresDBModule,
  Profile,
  SharedModule,
  SharedService,
  User,
} from '@app/shared';

@Module({
  imports: [
    SharedModule,
    PostgresDBModule,
    SequelizeModule.forFeature([Role, UserRole, User, Profile]),
  ],
  controllers: [RolesController],
  providers: [
    RolesService,
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService,
    },
  ],
})
export class RolesModule {}
