import { Module } from '@nestjs/common';
import { PersonController } from './person.controller';
import { PersonService } from './person.service';
import { PostgresDBModule, SharedModule, SharedService } from '@app/shared';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SharedModule, PostgresDBModule, SequelizeModule.forFeature([])],
  controllers: [PersonController],
  providers: [
    PersonService,
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService,
    },
  ],
})
export class PersonModule {}
