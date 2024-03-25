import { AdminEntity } from 'src/admin_auth/admin_auth_entity/admin_entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { doctorEntity } from './Doctor_entity';

@Entity("Department")
export class department_entity{

    @PrimaryGeneratedColumn()
    depId:number;

    @Column({ nullable: false })
    depName: string;

    @Column({nullable:false})
    date:string;

    @ManyToOne(() => AdminEntity, admin => admin.departments) 
    admin: AdminEntity;

    @OneToMany(() => doctorEntity, doctor => doctor.department)
    doctors: doctorEntity[];


}


