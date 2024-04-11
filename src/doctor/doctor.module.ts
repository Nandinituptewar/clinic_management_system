import { Module } from '@nestjs/common';
import { Doctor } from 'src/entities/doctor.entity';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module( {
    imports: [ TypeOrmModule.forFeature( [ Doctor ] ) ],
    controllers: [ DoctorController ],
    providers: [ DoctorService ]
} )

export class DoctorModule { }
