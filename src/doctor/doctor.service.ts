// src/services/doctor.service.ts
import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from '../entities/doctor.entity';
import CustomResponse from 'src/common/providers/custom-response.service';
import { CustomMessages } from 'src/common/const/custom-messages';
import CustomError from 'src/common/exceptions/custom-error';

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository( Doctor )
    private readonly doctorRepository: Repository<Doctor>,
  ) { }

  //create doctor entity
  async create ( doctorData ) {
    try {
      const doctor = this.doctorRepository.create( doctorData );
      const createdPatient = await this.doctorRepository.save( doctor );
      return new CustomResponse( HttpStatus.OK, CustomMessages.SUCCESS, createdPatient );
    } catch ( error ) {
      if ( error.code === '23505' ) {
        // PostgreSQL error code for unique violation
        throw new CustomError( HttpStatus.BAD_REQUEST, CustomMessages.DOCTOR_ENTRY_EXIST );
      }
      console.log( "error", error );
      throw new CustomError( HttpStatus.BAD_REQUEST, CustomMessages.FAILURE );
    }
  }

  //update doctor entity
  async update ( id: string, doctorData ) {
    try {
      const doctor = await this.doctorRepository.findOne( {
        where: {
          id: id,
        }
      } );
      if ( !doctor ) {
        throw new CustomError( HttpStatus.BAD_REQUEST, CustomMessages.DOCTOR_NOT_FOUND );
      }
      const updatedDoctor = await this.doctorRepository.save( doctorData );
      return new CustomResponse( HttpStatus.OK, CustomMessages.SUCCESS, updatedDoctor );
    } catch ( error ) {
      console.log( "err", error );
      throw new CustomError( HttpStatus.BAD_REQUEST, CustomMessages.FAILURE );
    }
  }

  //get doctor data
  async findOne ( id: string ) {
    try {
      const doctorData = await this.doctorRepository.findOne( {
        where: {
          id: id,
        }
      } );
      return new CustomResponse( HttpStatus.OK, CustomMessages.SUCCESS, doctorData );
    } catch ( err ) {
      console.log( "err", err );
      throw new CustomError( HttpStatus.BAD_REQUEST, CustomMessages.FAILURE );
    }
  }

  //delete doctor
  async delete ( id: string ) {
    try {
      const existPatient = await this.doctorRepository.findOne( { where: { id: id } } );
      if ( existPatient ) {
        throw new CustomError( HttpStatus.BAD_REQUEST, CustomMessages.DOCTOR_NOT_FOUND );
      }
      const deletedData = await this.doctorRepository.delete( id );
      return new CustomResponse( HttpStatus.OK, CustomMessages.SUCCESS, deletedData );
    }
    catch ( err ) {
      console.log( "err", err );
      throw new CustomError( HttpStatus.BAD_REQUEST, CustomMessages.FAILURE );
    }
  }
}
