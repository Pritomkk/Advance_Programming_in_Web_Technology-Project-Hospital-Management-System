import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { adminProfile } from './adminProfile_entity';
import {  department_entity } from 'src/admin_operation/admin_opration_entity/Department_entity';
import { doctorEntity } from 'src/admin_operation/admin_opration_entity/Doctor_entity';
import { paitent_entity } from 'src/admin_operation/admin_opration_entity/paitent_entity';
import { AppointmentEntity } from 'src/admin_operation/admin_opration_entity/Appointment_entity';

@Entity("admin")
export class AdminEntity {
    @PrimaryGeneratedColumn()
    Adminid: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: true }) 
    date: string;

    @Column({ nullable: true }) 
    phone: string;

    @Column({ nullable: true }) 
    gender: string;

    @Column({ nullable: true }) 
    profilePicture: string;
///////////////////////
    @OneToOne(() =>adminProfile, a_profile=>a_profile.admin)
    admin_p:adminProfile
////////////////////////////////////
    @OneToMany(() =>department_entity, department => department.admin, { cascade: true }) // Define the one-to-many relationship with cascade option
    departments:department_entity[]; 
////////////////////////////
    @OneToMany(() =>doctorEntity, doctor => doctor.admin, { cascade: true }) // Define the one-to-many relationship with cascade option
    doctors:doctorEntity[];

    @OneToMany(() =>paitent_entity, paitent=> paitent.admin, { cascade: true }) // Define the one-to-many relationship with cascade option
    paitent:paitent_entity[];

    @OneToMany(() =>AppointmentEntity, appointment => appointment.admin)
    appointments: AppointmentEntity[];
}


