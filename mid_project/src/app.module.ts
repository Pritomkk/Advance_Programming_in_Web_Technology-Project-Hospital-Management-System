import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminAuthModule } from './admin_auth/admin_auth.module';
import { AdminOperationModule } from './admin_operation/admin_operation.module';
 
@Module({
  imports: [TypeOrmModule.forRoot(
    { type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'pritom',
    database: 'mid_project_database',
    autoLoadEntities: true,
    synchronize: true,
    } ), AdminAuthModule,AdminOperationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
