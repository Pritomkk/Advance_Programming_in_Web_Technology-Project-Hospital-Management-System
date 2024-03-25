import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AdminEntity } from 'src/admin_auth/admin_auth_entity/admin_entity';
import { department_entity } from './admin_opration_entity/Department_entity';
import { department_dto } from './admin_operation_dto/Department_dto';
import { doctor_profile_dto } from './admin_operation_dto/Doctor_dto';
import { doctorEntity } from './admin_opration_entity/Doctor_entity';
import { dischargePaitent_dto, paitent_dto } from './admin_operation_dto/paitent_dto';
import { paitent_entity } from './admin_opration_entity/paitent_entity';
import { AppointmentDto } from './admin_operation_dto/Appoinment_dto';
import { AppointmentEntity } from './admin_opration_entity/Appointment_entity';

@Injectable()
export class AdminOperationService {

constructor(
  @InjectRepository(AdminEntity)
  private adminRepository: Repository<AdminEntity>,
  @InjectRepository(department_entity)
  private departmentRepository: Repository<department_entity>,
  @InjectRepository(doctorEntity)
  private doctorRepository: Repository<doctorEntity>,
  @InjectRepository(paitent_entity)
  private paitentRepository: Repository<paitent_entity>,
  @InjectRepository(AppointmentEntity)
  private appionmentRepository: Repository<AppointmentEntity>,


) { }


async createDepartment(sessionEmail: string, data:department_dto): Promise<department_entity> {
  const admin = await this.adminRepository.findOne({ where: { email: sessionEmail } });
  if (!admin) {
      throw new Error('Admin not found');
  }

  const department = new department_entity();
  department.depName =data.depName;
  department.date=data.date;
  department.admin = admin;
  return this.departmentRepository.save(department);

}

async viewDepartmet(): Promise<department_entity[]> {
  return this.departmentRepository.find();
}

async assignDoctor(sessionEmail: string, data:doctor_profile_dto, departmentName: string): Promise<doctorEntity> {
  const admin = await this.adminRepository.findOne({ where: { email: sessionEmail } });
  if (!admin) {
    throw new Error('Admin not found');
  }
  const department = await this.departmentRepository.findOne({ where: { depName: departmentName } });
  if (!department) {
    throw new Error('Department not found');
  }
  const newDoctor = new doctorEntity();
  newDoctor.doctorName = data.doctorName;
  newDoctor.email = data.email;
  newDoctor.phone = data.phone;
  newDoctor.gender = data.gender;
  newDoctor.maxCheekUpPaitent=data.maxCheekUpPaitent
  newDoctor.admin = admin;
  newDoctor.department = department; 
  return this.doctorRepository.save(newDoctor);
}

async viewDoctor(doctorId:number): Promise<doctorEntity> {
   return await this.doctorRepository.findOne({ where: {Doctorid:doctorId}, relations:["department"] });
}


async updateDoctorProfile(sessionEmail: string, doctorId: number, data:doctor_profile_dto, departmentName: string): Promise<doctorEntity> {
  const admin = await this.adminRepository.findOne({ where: { email: sessionEmail } });
  if (!admin) {
    throw new Error('Admin not found');
  }
  const department = await this.departmentRepository.findOne({ where: { depName: departmentName } });
  if (!department) {
    throw new Error('Department not found');
  }
  const doctorToUpdate = await this.doctorRepository.findOne({where:{Doctorid:doctorId}});
  if (!doctorToUpdate) {
    throw new Error('Doctor not found');
  }

  doctorToUpdate.doctorName = data.doctorName;
  doctorToUpdate.email = data.email;
  doctorToUpdate.phone = data.phone;
  doctorToUpdate.gender = data.gender;
  doctorToUpdate.maxCheekUpPaitent=data.maxCheekUpPaitent;
  doctorToUpdate.admin = admin;
  doctorToUpdate.department = department;

  return this.doctorRepository.save(doctorToUpdate);
}

async getDoctorById(Doctorid: number): Promise<doctorEntity> {
  return this.doctorRepository.findOneBy({Doctorid});
}


async admitPaitent(sessionEmail: string, data:paitent_dto): Promise<paitent_entity> {
  const admin = await this.adminRepository.findOne({ where: { email: sessionEmail } });
  if (!admin) {
    throw new Error('Admin not found');
  }
  
  const admitPaitent = new paitent_entity();
  admitPaitent.paitentName= data.paitentName;
  admitPaitent.email = data.email;
  admitPaitent.phone = data.phone;
  admitPaitent.gender = data.gender;
  admitPaitent.admissionDate=data.admissionDate;
  admitPaitent.status=data.status;
  admitPaitent.admin = admin; 
  return this.paitentRepository.save(admitPaitent);
}

async dischargePaitent(sessionEmail: string, patientId: number, data:dischargePaitent_dto): Promise<paitent_entity> {
  const admin = await this.adminRepository.findOne({ where: { email: sessionEmail } });
  if (!admin) {
    throw new Error('Admin not found');
  }

  const patient = await this.paitentRepository.findOne({ where: {paitentid: patientId } });
  if (!patient) {
    throw new Error('Patient not found');
  }

  patient.status = data.status;
  patient.dischargeDate= data.dischargeDate
  patient.admin = admin;

  return this.paitentRepository.save(patient);
}

async SearchpaitentInfo(paitentid: number): Promise<paitent_entity> {
  return this.paitentRepository.findOne({where:{paitentid:paitentid}});
}

async getAllPatients(): Promise<paitent_entity[]> {
  return await this.paitentRepository.find();
}

async Appionment(sessionEmail: string, data: AppointmentDto, doctorId: number, patientId: number): Promise<AppointmentEntity> {
  const admin = await this.adminRepository.findOne({ where: { email: sessionEmail } });
  if (!admin) {
    throw new Error('Admin not found');
  }

  const doctor= await this.doctorRepository.findOne({ where: { Doctorid: doctorId } });
 // const maxCheekUpPaitent = doctor.maxCheekUpPaitent;
  if (!doctor) {
    throw new Error('Doctor not found');
  }

  const patient = await this.paitentRepository.findOne({ where: { paitentid: patientId } });
  if (!patient) {
    throw new Error('Patient not found');
  }

  const appointment = new AppointmentEntity();
  appointment.appointmentDate = data.appointmentDate;
  appointment.appointmentTime = data.appointmentTime;
  appointment.appointmentStatus = data.appointmentStatus;
  appointment.paitentAppionmentSerial =data.paitentAppionmentSerial;
  appointment.admin = admin;
  appointment.doctor=doctor;
  appointment.paitent=patient;

  // Save the appointment
  return this.appionmentRepository.save(appointment);
}


async viewAllAppointments(): Promise<AppointmentEntity[]> {
  try {
    return await this.appionmentRepository.find();
  } catch (error) {
    throw new Error('Failed to view appointments');
  }
}


async searchAppointment(appointmentId: number): Promise<AppointmentEntity> {
  try {
    return await this.appionmentRepository.findOne({ where: { appointment_ID: appointmentId } });
  } catch (error) {
    throw new Error('Failed to search appointment');
  }
}

async searchDoctorAppointments(doctorId: number): Promise<AppointmentEntity[]> {
  try {
    // Find appointments for the specified doctor along with the doctor's and patient's name
    const appointments = await this.appionmentRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .leftJoinAndSelect('appointment.paitent', 'paitent')
      .where('doctor.Doctorid = :doctorId', { doctorId })
      .getMany();

    return appointments;
  } catch (error) {
    throw new Error('Failed to search doctor appointments');
  }
}


}