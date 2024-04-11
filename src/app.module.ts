import { Module } from '@nestjs/common';
import { PatientModule } from './patient/patient.module';
import { DoctorModule } from './doctor/doctor.module';
import { AppointmentModule } from './appointment/appointment.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patient } from './entities/patient.entity';
import { Doctor } from './entities/doctor.entity';
import { Appointment } from './entities/appointment.entity';

@Module( {
  imports: [
    TypeOrmModule.forRoot( {
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: 'admin',
      database: 'clinic_db',
      entities: [ Patient, Doctor, Appointment ],
      synchronize: true
    } ),
    PatientModule,
    DoctorModule,
    AppointmentModule
  ],
  controllers: [],
  providers: [],
} )
export class AppModule { }
