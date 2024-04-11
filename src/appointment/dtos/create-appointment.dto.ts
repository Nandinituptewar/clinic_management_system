import { IsNotEmpty, IsDateString, IsUUID } from 'class-validator';

export class CreateAppointmentDto {
    @IsUUID()
    @IsNotEmpty()
    patientId: string;

    @IsUUID()
    @IsNotEmpty()
    doctorId: string;

    @IsDateString()
    @IsNotEmpty()
    preferredDate: Date;
}
