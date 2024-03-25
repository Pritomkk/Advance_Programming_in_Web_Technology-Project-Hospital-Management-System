import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AdminEntity } from './admin_entity';

@Entity("adminProfile")
export class adminProfile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: true }) 
    gender: string;
 
    @OneToOne(()=>AdminEntity,a_entity=>a_entity.admin_p,{ cascade: true})
    @JoinColumn()
    admin: AdminEntity;
    
}