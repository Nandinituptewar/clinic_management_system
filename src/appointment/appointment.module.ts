import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from 'src/entities/appointment.entity';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { PatientModule } from 'src/patient/patient.module';
import { DoctorModule } from 'src/doctor/doctor.module';
import { Doctor } from 'src/entities/doctor.entity';
import { Patient } from 'src/entities/patient.entity';

@Module( {
    imports: [ TypeOrmModule.forFeature( [ Appointment ] ), TypeOrmModule.forFeature( [ Doctor ] ), TypeOrmModule.forFeature( [ Patient ] ) ],
    controllers: [ AppointmentController ],
    providers: [ AppointmentService, ]
} )

export class AppointmentModule { }
