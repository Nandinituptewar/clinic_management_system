import { Module } from '@nestjs/common';
import { Patient } from 'src/entities/patient.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';

@Module( {
    imports: [ TypeOrmModule.forFeature( [ Patient ] ) ],
    controllers: [ PatientController ],
    providers: [ PatientService ]
} )

export class PatientModule { }
