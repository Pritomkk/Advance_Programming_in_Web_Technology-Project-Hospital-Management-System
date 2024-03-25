import { Module } from '@nestjs/common';
import { AdminOperationController } from './admin_operation.controller';
import { AdminOperationService } from './admin_operation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { doctorEntity } from './admin_opration_entity/Doctor_entity'; // Corrected entity name to follow PascalCase
import { department_entity } from './admin_opration_entity/Department_entity'; // Corrected entity name to follow PascalCase
import { AdminEntity } from 'src/admin_auth/admin_auth_entity/admin_entity';
import { AdminAuthModule } from 'src/admin_auth/admin_auth.module';
import { JwtModule } from '@nestjs/jwt';
import { paitent_entity } from './admin_opration_entity/paitent_entity';
import { AppointmentEntity } from './admin_opration_entity/Appointment_entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([doctorEntity,department_entity, AdminEntity,paitent_entity,AppointmentEntity]), // Removed semicolon and corrected entity names
    JwtModule.register({
      secret: 'Kiddo&Fugi(pritom)',
      signOptions: { expiresIn: '20min' }, 
    }),
    AdminAuthModule, // Add your Auth module if needed
  ],
  controllers: [AdminOperationController],
  providers: [AdminOperationService],
})
export class AdminOperationModule {}
