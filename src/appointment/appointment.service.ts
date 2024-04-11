import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';
import { Doctor } from 'src/entities/doctor.entity';
import { Patient } from 'src/entities/patient.entity';
import CustomError from 'src/common/exceptions/custom-error';
import { CustomMessages } from 'src/common/const/custom-messages';
import CustomResponse from 'src/common/providers/custom-response.service';


@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository( Appointment )
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository( Doctor ) private doctorRepository: Repository<Doctor>,
    @InjectRepository( Patient ) private patientRepository: Repository<Patient>,
  ) { }

  //book appointment
  async bookAppointment ( appointmentDto ) {
    try {
      const { patientId, doctorId, preferredDate } = appointmentDto;
      const patient = await this.patientRepository.findOne( { where: { id: patientId } } );
      const doctor = await this.doctorRepository.findOne( { where: { id: doctorId } } );

      if ( !patient ) {
        throw new CustomError( HttpStatus.BAD_REQUEST, CustomMessages.PATIENT_NOT_FOUND );
      }

      if ( !doctor ) {
        throw new CustomError( HttpStatus.BAD_REQUEST, CustomMessages.DOCTOR_NOT_FOUND );
      }

      const appointmentTime = new Date( preferredDate );

      const isAvailable = doctor.availability.some( slot => {
        const slotStart = new Date( slot.start );
        const slotEnd = new Date( slot.end );
        return appointmentTime >= slotStart && appointmentTime < slotEnd;
      } );

      if ( !isAvailable ) {
        throw new CustomError( HttpStatus.BAD_REQUEST, CustomMessages.DOCTOR_NOT_AVAILABLE );
      }

      // Check if there's an existing appointment that overlaps with the new appointment's time slot
      const rangeStart = new Date( appointmentTime.getTime() - 30 * 60000 ); // 30 minutes before
      const rangeEnd = new Date( appointmentTime.getTime() + 30 * 60000 ); // 30 minutes after
      // Check if any appointment already exists within the specified range
      const existingAppointment = await this.appointmentRepository.findOne( {
        where: {
          preferredDate: Between( rangeStart, rangeEnd )
        }
      } );
      if ( existingAppointment ) {
        throw new CustomError( HttpStatus.BAD_REQUEST, CustomMessages.PREFERED_TIME_BOOK );
      }

      const newAppointment = this.appointmentRepository.create( {
        patient,
        doctor,
        preferredDate: appointmentTime,
      } );
      const appointmentData = await this.appointmentRepository.save( newAppointment );
      return new CustomResponse( HttpStatus.OK, CustomMessages.SUCCESS, appointmentData );
    }
    catch ( err ) {
      console.log( "err", err );
      throw new CustomError( HttpStatus.BAD_REQUEST, CustomMessages.FAILURE );
    }
  }


  //update appointment
  async updateAppointment ( id: string, appointmentData ) {
    try {
      const appointment = await this.appointmentRepository.findOne( {
        where: {
          id: id,
        }
      } );
      if ( !appointment ) {
        throw new CustomError( HttpStatus.BAD_REQUEST, CustomMessages.APPOINTMENT_NOT_FOUND );
      }
      Object.assign( appointment, appointmentData );
      const appointmentResponse = await this.appointmentRepository.save( appointment );
      return new CustomResponse( HttpStatus.OK, CustomMessages.SUCCESS, appointmentResponse );
    } catch ( err ) {
      console.log( "err", err );
      throw new CustomError( HttpStatus.BAD_REQUEST, CustomMessages.FAILURE );
    }
  }


  //list appointments 
  async listAppointmentsForDoctorOnDate ( doctorId: string, date: Date ) {
    // Define the start and end of the given date
    try {
      const startDate = new Date( date );
      startDate.setHours( 0, 0, 0, 0 );
      const endDate = new Date( date );
      endDate.setHours( 23, 59, 59, 999 );

      // Retrieve appointments for the specified doctor on the given date
      const appointmentResponse = await this.appointmentRepository.find( {
        where: {
          doctor: { id: doctorId },
          preferredDate: Between( startDate, endDate ),
        },
      } );

      return new CustomResponse( HttpStatus.OK, CustomMessages.SUCCESS, appointmentResponse );

    } catch ( err ) {
      console.log( "err", err );
      throw new CustomError( HttpStatus.BAD_REQUEST, CustomMessages.FAILURE );
    }
  }


  //get avaliable slots for doctor after given date
  async getAvailableTimeSlotsForDoctor ( doctorId: string, date: Date ) {
    try {
      const doctor = await this.doctorRepository.findOne( { where: { id: doctorId } } );
      if ( !doctor ) {
        throw new CustomError( HttpStatus.BAD_REQUEST, CustomMessages.DOCTOR_NOT_FOUND );
      }

      // Check if the provided date falls within any availability range
      const isDateInRange = doctor.availability.some( availability => {
        const start = new Date( availability.start );
        const end = new Date( availability.end );
        // Ensure that the provided date falls within the availability range
        return date >= start && date <= end;
      } );

      if ( !isDateInRange ) {
        throw new CustomError( HttpStatus.BAD_REQUEST, CustomMessages.DOCTOR_NOT_AVAILABLE );
      }

      // Extract start and end times from the availability range for the provided date
      const availabilityForDate = doctor.availability.find( availability => {
        const start = new Date( availability.start );
        const end = new Date( availability.end );
        return date >= start && date <= end;
      } );

      if ( !availabilityForDate ) {
        throw new CustomError( HttpStatus.BAD_REQUEST, CustomMessages.DOCTOR_NOT_AVAILABLE );
      }

      const { start, end } = availabilityForDate;

      // Calculate available time slots by excluding booked appointments
      const existingAppointments = await this.appointmentRepository.find( {
        where: {
          doctor: { id: doctorId },
          preferredDate: date,
        },
      } );

      const startTime = new Date( start );
      const endTime = new Date( end );
      const timeSlots: string[] = [];

      // Calculate time slots with 30-minute intervals
      while ( startTime < endTime ) {
        const slotEnd = new Date( startTime.getTime() + 30 * 60000 ); // Add 30 minutes
        const slotString = `${ startTime.toISOString() } - ${ slotEnd.toISOString() }`;

        // Check if the slot is available (not booked)
        if ( !existingAppointments.some( appointment => {
          const appointmentStart = new Date( appointment.preferredDate );
          const appointmentEnd = new Date( appointmentStart.getTime() + 30 * 60000 ); // Assuming appointments are 30 minutes long
          return startTime >= appointmentStart && startTime < appointmentEnd;
        } ) ) {
          timeSlots.push( slotString );
        }

        startTime.setTime( startTime.getTime() + 30 * 60000 ); // Move to next slot
      }

      return new CustomResponse( HttpStatus.OK, CustomMessages.SUCCESS, timeSlots );

    } catch ( err ) {
      console.log( err );
      throw new CustomError( HttpStatus.BAD_REQUEST, CustomMessages.FAILURE );
    }
  }


  //cancel appointment
  async cancelAppointment ( id: string ) {
    try {
      const existPatient = await this.patientRepository.findOne( { where: { id: id } } );
      if ( existPatient ) {
        throw new CustomError( HttpStatus.BAD_REQUEST, CustomMessages.APPOINTMENT_NOT_FOUND );
      }
      const deletedData = await this.patientRepository.delete( id );
      return new CustomResponse( HttpStatus.OK, CustomMessages.SUCCESS, deletedData );
    }
    catch ( err ) {
      throw new CustomError( HttpStatus.BAD_REQUEST, CustomMessages.FAILURE );
    }
  }
}
