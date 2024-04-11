
import { Controller, Post, Body, Get, Param, Delete } from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dtos';

@Controller( 'patients' )
export class PatientController {
  constructor( private readonly patientService: PatientService ) { }

  @Post()
  async create ( @Body() patientData: CreatePatientDto ) {
    return this.patientService.create( patientData );
  }

  @Get( ':id' )
  async findOne ( @Param( 'id' ) id: string ) {
    return this.patientService.findOne( id );
  }

  @Delete( ':id' )
  async delete ( @Param( 'id' ) id: string ) {
    return this.patientService.delete( id );
  }
}
