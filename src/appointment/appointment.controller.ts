import { Controller, Post, Body, Get, Param, Patch, Delete, Query } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { CreateAppointmentDto, UpdateAppointmentDto } from './dtos';

@Controller( 'appointments' )
export class AppointmentController {
    constructor( private readonly appointmentService: AppointmentService ) { }

    @Post()
    async bookAppointment ( @Body() appointmentData: CreateAppointmentDto ) {
        return this.appointmentService.bookAppointment( appointmentData );
    }

    @Patch( ':id' )
    async updateAppointment ( @Param( 'id' ) id: string, @Body() appointmentData: UpdateAppointmentDto ) {
        return this.appointmentService.updateAppointment( id, appointmentData );
    }

    @Get( 'doctor/:doctorId/date/:date' )
    async listAppointmentsForDoctorOnDate (
        @Param( 'doctorId' ) doctorId: string,
        @Param( 'date' ) date: string,
    ) {
        return this.appointmentService.listAppointmentsForDoctorOnDate( doctorId, new Date( date ) );
    }

    @Get( 'doctor/:doctorId/available-slots' )
    async getAvailableTimeSlotsForDoctor (
        @Param( 'doctorId' ) doctorId: string,
        @Query( 'date' ) date: string,
    ) {
        return this.appointmentService.getAvailableTimeSlotsForDoctor( doctorId, new Date( date ) );
    }

    @Delete( ':id' )
    async cancelAppointment ( @Param( 'id' ) id: string ) {
        return this.appointmentService.cancelAppointment( id );
    }
}
