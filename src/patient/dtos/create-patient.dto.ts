import { IsString, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePatientDto {
    @IsString()
    readonly name: string;

    @IsString()
    readonly dateOfBirth: string;

    @IsString()
    readonly contactNumber: string;
}
