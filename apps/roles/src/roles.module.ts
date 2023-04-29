import { Module } from '@nestjs/common';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Role, UsersRoles } from './entities';
import { PostgresDBModule, SharedModule, SharedService } from '@app/shared';

@Module({
  providers: [
    RolesService,
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService,
    },
  ],
  controllers: [RolesController],
  imports: [
    SharedModule,
    PostgresDBModule,
    SequelizeModule.forFeature([Role, UsersRoles]),
  ],
  exports: [RolesService],
})
export class RolesModule {}
