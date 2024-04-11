import { Controller, Post, Body, Get, Param, Delete, Patch } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { CreateDoctorDto, UpdateDoctorDto } from './dtos';

@Controller( 'doctors' )
export class DoctorController {
  constructor( private readonly doctorService: DoctorService ) { }

  @Post()
  async create ( @Body() doctorData: CreateDoctorDto ) {
    return this.doctorService.create( doctorData );
  }

  @Get( ':id' )
  async findOne ( @Param( 'id' ) id: string ) {
    return this.doctorService.findOne( id );
  }

  @Patch( ':id' )
  async update ( @Param( 'id' ) id: string, @Body() updateDoctorDto: UpdateDoctorDto ) {
    return this.doctorService.update( id, updateDoctorDto );
  }

  @Delete( ':id' )
  async delete ( @Param( 'id' ) id: string ) {
    return this.doctorService.delete( id );
  }
}
