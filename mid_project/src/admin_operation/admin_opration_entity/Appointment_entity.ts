import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { doctorEntity } from './Doctor_entity';
import { paitent_entity } from './paitent_entity';
import { AdminEntity } from 'src/admin_auth/admin_auth_entity/admin_entity';


@Entity("appoinment")
export class AppointmentEntity {
  @PrimaryGeneratedColumn()
  appointment_ID: number;

  @Column({ nullable: false })
  appointmentDate: string;

  @Column({ nullable: false })
  appointmentTime: string;

  @Column({ nullable: false })
  appointmentStatus: string; // scheduled,canceled

  @Column({ nullable: false })
  paitentAppionmentSerial:number;

  @ManyToOne(() =>doctorEntity, doctor => doctor.appointments)
  doctor:doctorEntity;

  @ManyToOne(() =>AdminEntity, admin => admin.appointments)
    admin: AdminEntity;

  @ManyToOne(() =>paitent_entity, paitent => paitent.appointments)
  paitent: paitent_entity;
}
