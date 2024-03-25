import { AdminEntity } from 'src/admin_auth/admin_auth_entity/admin_entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { AppointmentEntity } from './Appointment_entity';

@Entity("Paitent")
export class paitent_entity{
    @PrimaryGeneratedColumn()
    paitentid: number;

    @Column({ nullable: false })
    paitentName: string;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: true, type: 'timestamp' })
    admissionDate:string | null;

    @Column({ nullable: true, type: 'timestamp' })
    dischargeDate:string | null;

    @Column({ nullable: false })
    phone: string;

    @Column({ nullable: false })
    gender: string;

    @Column({ nullable: false })
    status: string;

    @OneToMany(() => AppointmentEntity, appointment => appointment.paitent)
    appointments: AppointmentEntity[];

    @ManyToOne(() =>AdminEntity, admin => admin.paitent) 
    admin: AdminEntity;
}

