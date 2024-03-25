import { Body,Get, Session,HttpException, HttpStatus, Param, ParseIntPipe, Post, Query, UseGuards, UsePipes, ValidationPipe, UnauthorizedException, InternalServerErrorException, Put, NotFoundException } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AdminOperationService } from './admin_operation.service';
import { department_dto } from './admin_operation_dto/Department_dto';
import { AdminSessionGuard } from 'src/admin_auth/admin_auth_SessionGuard';
import { doctor_profile_dto } from './admin_operation_dto/Doctor_dto';
import { doctorEntity } from './admin_opration_entity/Doctor_entity';
import { dischargePaitent_dto, paitent_dto } from './admin_operation_dto/paitent_dto';
import { paitent_entity } from './admin_opration_entity/paitent_entity';
import { AppointmentDto } from './admin_operation_dto/Appoinment_dto';
import { AppointmentEntity } from './admin_opration_entity/Appointment_entity';


@Controller('adminOperation')
export class AdminOperationController{

constructor(private readonly AdminOperationService: AdminOperationService) { }

@UseGuards(AdminSessionGuard)
@Post('/CreateDepartment')
@UsePipes(new ValidationPipe())
async createDepartment(@Body() data:department_dto, @Session() session): Promise<any> {
    try {
        const result = await this.AdminOperationService.createDepartment(session.email, data);
        return {message:"Sucessfully Create Department"};
    } catch (error) {
        return { success: false, error: error.message };
    }
}


@UseGuards(AdminSessionGuard)
@Get('/ViewDeparment')
    viewDep(): any {
        return this.AdminOperationService.viewDepartmet();
}


@UseGuards(AdminSessionGuard)
@Post('assignDoctor/:departmentName')
async assignDoctorToDepartment(
  @Body(new ValidationPipe()) doctorData:doctor_profile_dto,
  @Session() session: Record<string, any>,
  @Param('departmentName') departmentName: string,
): Promise<{ success: boolean; message?: string }> {
  try {
    if (!session || !session.email) {
      throw new UnauthorizedException('Session Not Active, Please Sign Up');
    }

    await this.AdminOperationService.assignDoctor(session.email, doctorData, departmentName);

    return { success: true, message: 'Doctor assigned to department successfully' };
  } 
  
  catch (error) {
    if (error instanceof HttpException && error.getResponse()) {
      throw error; 
    }
    throw new InternalServerErrorException('Internal Server Error'); // Catch any unexpected errors
  }
}

@Get('viewDoctor/:doctorId')
async viewDoctor(@Param('doctorId') doctorId: number): Promise<{ success: boolean; data?:doctorEntity; message?: string }> {
  try {
    const doctor = await this.AdminOperationService.viewDoctor(doctorId);
    if (!doctor) {
      return { success: false, message: 'Doctor not found' };
    }
    return { success: true, data: doctor };
  } catch (error) {
    return { success: false, message: error.message };
  }
}


@Put('updateDoctorProfile/:doctorId/:departmentName')
async updateDoctorProfile(
  @Session() session: Record<string, any>,
  @Param('doctorId') doctorId: number,
  @Param('departmentName') departmentName: string,
  @Body(new ValidationPipe()) doctorData: doctor_profile_dto,
): Promise<{ success: boolean; data?: doctorEntity; message?: string }> {
  try {
    if (!session || !session.email) {
      throw new UnauthorizedException('Session not active, please sign in');
    }

    const updatedDoctor = await this.AdminOperationService.updateDoctorProfile(session.email, doctorId, doctorData, departmentName);
    
    return { success: true,message: 'Doctor profile updated successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
}



  @UseGuards(AdminSessionGuard)
  @Get('/search/:Doctorid')
  async getDoctorById(@Param('Doctorid', ParseIntPipe) Doctorid: number): Promise<doctor_profile_dto> {
      const res = await this.getDoctorById(Doctorid);
      if (res !== null) {
          return await this.AdminOperationService.getDoctorById(Doctorid);
      }
      else {
          throw new HttpException("Doctor not  found", HttpStatus.NOT_FOUND);
      }
  }

  @UseGuards(AdminSessionGuard)
  @Post('/admitPaitent')
  @UsePipes(new ValidationPipe())
  async admitPaitent(@Body() data:paitent_dto, @Session() session): Promise<any> {
      try {
          const result = await this.AdminOperationService.admitPaitent(session.email, data);
          return {message:"Sucessfully admit the paitent"};
      } catch (error) {
          return { success: false, error: error.message };
      }
  }

  @UseGuards(AdminSessionGuard)
  @Post('dischargePatient/:patientId')
  async dischargePatient(
    @Session() session: { email: string },
    @Param('patientId') patientId: number,
    @Body(new ValidationPipe()) patientData:dischargePaitent_dto,
  ): Promise<{ success: boolean; message?: string }> {
    try {
      if (!session || !session.email) {
        throw new UnauthorizedException('Session not active, please sign in');
      }

      await this.AdminOperationService.dischargePaitent(session.email, patientId, patientData);
      return { success: true, message: 'Patient discharged successfully' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @UseGuards(AdminSessionGuard)
  @Get('searchPaitent/:id')
  async searchPaitentInfo(@Param('id') paitentId: number): Promise<paitent_entity> {
    const paitent = await this.AdminOperationService.SearchpaitentInfo(paitentId);
    if (!paitent) {
      throw new NotFoundException('Patient not found');
    }
    return paitent;
  }
  @UseGuards(AdminSessionGuard)
  @Get("allPaitentInfo")
  async getAllPatients(): Promise<paitent_entity[]> {
    const patients = await this.AdminOperationService.getAllPatients();
    if (!patients || patients.length === 0) {
      throw new NotFoundException('No patients found');
    }
    return patients;
  }

  @UseGuards(AdminSessionGuard)
  @Post('Appionment/:doctorId/:patientId')
  async createAppointment(
    @Session() session: Record<string, any>,
    @Body() data:AppointmentDto,
    @Param('doctorId') doctorId: number,
    @Param('patientId') patientId: number,
  ): Promise<{ success: boolean; message?: string; }> {
    try {
      if (!session || !session.email) {
        throw new UnauthorizedException('Session not active. Please log in.');
      }

      const Appointment = await this.AdminOperationService.Appionment(session.email, data, doctorId, patientId);

      return { success: true, message: 'Appointment created successfully'};
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  @UseGuards(AdminSessionGuard)
  @Get("viewAllAppionment")
  async viewAllAppointments(
    @Session() session: Record<string, any>,
  ): Promise<{ success: boolean; appointments?:AppointmentEntity[]; message?: string }> {
    try {
      if (!session || !session.email) {
        throw new UnauthorizedException('Session not active. Please log in.');
      }

      const appointments = await this.AdminOperationService.viewAllAppointments();

      return { success: true, appointments };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  @Get('searchAppointment/:appointmentId')
  async searchAppointment(
    @Session() session: Record<string, any>,
    @Param('appointmentId', ParseIntPipe) appointmentId: number,
  ): Promise<{ success: boolean; appointment?: AppointmentEntity; message?: string }> {
    try {
      if (!session || !session.email) {
        throw new UnauthorizedException('Session not active. Please log in.');
      }

      const appointment = await this.AdminOperationService.searchAppointment(appointmentId);

      if (!appointment) {
        return { success: false, message: 'Appointment not found' };
      }

      return { success: true, appointment };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }
  @UseGuards(AdminSessionGuard)
  @Get('doctorAppointments/:doctorId')
  async searchDoctorAppointments(
    @Param('doctorId') doctorId: number,
    @Session() session: Record<string, any>,
  ): Promise<{ success: boolean; appointments?: AppointmentEntity[]; message?: string }> {
    try {
      if (!session || !session.email) {
        throw new UnauthorizedException('Session not active. Please log in.');
      }

      const appointments = await this.AdminOperationService.searchDoctorAppointments(doctorId);

      return { success: true, appointments };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

}









