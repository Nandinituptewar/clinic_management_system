import { PartialType } from '@nestjs/mapped-types';
import { CreateAppointmentDto } from './create-appointment.dto';

export class UpdateAppointmentDto extends PartialType( CreateAppointmentDto ) { } // Use PartialType to make all properties optional
