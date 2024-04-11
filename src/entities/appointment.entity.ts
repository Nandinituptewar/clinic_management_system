// src/entities/appointment.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Patient } from './patient.entity';
import { Doctor } from './doctor.entity';

@Entity()
export class Appointment {
    @PrimaryGeneratedColumn( 'uuid' )
    id: string;

    @ManyToOne( () => Patient )
    @JoinColumn()
    patient: Patient;

    @ManyToOne( () => Doctor )
    @JoinColumn()
    doctor: Doctor;

    @Column()
    preferredDate: Date;
}
