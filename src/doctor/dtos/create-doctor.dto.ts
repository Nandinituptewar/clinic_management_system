import { IsString, IsEmail, IsArray, ArrayMinSize, ArrayMaxSize } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateDoctorDto {
    @IsString()
    readonly name: string;

    @IsString()
    readonly department: string;

    @IsEmail()
    readonly contactNumber: string;

    @IsArray()
    @Type( () => Date ) // Convert each element to string
    readonly availability: Date[]; // Array of strings representing availability time slots
}
