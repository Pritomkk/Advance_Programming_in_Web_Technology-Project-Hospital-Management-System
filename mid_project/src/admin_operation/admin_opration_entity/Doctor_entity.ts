
import { AdminEntity } from 'src/admin_auth/admin_auth_entity/admin_entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { department_entity } from './Department_entity';
import { AppointmentEntity } from './Appointment_entity';
@Entity("doctor")
export class doctorEntity {
    @PrimaryGeneratedColumn()
    Doctorid: number;

    @Column({ nullable: false })
    doctorName: string;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable:false }) 
    phone: string;

    @Column({ nullable: true }) 
    gender: string;

    @Column({ nullable: true }) 
    maxCheekUpPaitent:number;

    @ManyToOne(() => department_entity, department => department.doctors)
    department: department_entity;

    @ManyToOne(() =>AdminEntity, admin => admin.doctors) 
    admin: AdminEntity;

    @OneToMany(() =>AppointmentEntity, appointment => appointment.doctor)
    appointments: AppointmentEntity[];

}