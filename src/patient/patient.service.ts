// src/services/patient.service.ts
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';
import CustomError from 'src/common/exceptions/custom-error';
import { CustomMessages } from 'src/common/const/custom-messages';
import CustomResponse from 'src/common/providers/custom-response.service';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository( Patient )
    private readonly patientRepository: Repository<Patient>,
  ) { }

  //create patient
  async create ( patientData ) {
    try {
      const patient = this.patientRepository.create( patientData );
      const data = await this.patientRepository.save( patient );
      return new CustomResponse( HttpStatus.OK, CustomMessages.SUCCESS, data );
    } catch ( err ) {
      throw new CustomError( HttpStatus.BAD_REQUEST, CustomMessages.FAILURE );
    }
  }

  //update patient
  async update ( id: string, patientData ) {
    try {
      const patient = await this.patientRepository.findOne( {
        where: {
          id: id,
        }
      } );
      if ( !patient ) {
        throw new CustomError( HttpStatus.BAD_REQUEST, CustomMessages.PATIENT_NOT_FOUND );
      }
      Object.assign( patient, patientData );
      const updatedPatient = await this.patientRepository.save( patient );
      return new CustomResponse( HttpStatus.OK, CustomMessages.SUCCESS, updatedPatient );
    } catch ( error ) {
      console.log( "error", error );
      throw new CustomError( HttpStatus.BAD_REQUEST, CustomMessages.FAILURE );
    }
  }

  //find patient
  async findOne ( id: string ) {
    try {
      const patientData = await this.patientRepository.findOne( {
        where: {
          id: id,
        }
      } );
      return new CustomResponse( HttpStatus.OK, CustomMessages.SUCCESS, patientData );
    } catch ( err ) {
      throw new CustomError( HttpStatus.BAD_REQUEST, CustomMessages.FAILURE );
    }
  }

  //delete patient
  async delete ( id: string ) {
    try {
      const existPatient = await this.patientRepository.findOne( { where: { id: id } } );
      if ( existPatient ) {
        throw new CustomError( HttpStatus.BAD_REQUEST, CustomMessages.PATIENT_NOT_FOUND );
      }
      const deletedData = await this.patientRepository.delete( id );
      return new CustomResponse( HttpStatus.OK, CustomMessages.SUCCESS, deletedData );
    }
    catch ( err ) {
      throw new CustomError( HttpStatus.BAD_REQUEST, CustomMessages.FAILURE );
    }
  }
}
