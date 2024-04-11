import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity()
@Unique( [ 'name' ] )
export class Doctor {
    @PrimaryGeneratedColumn( 'uuid' )
    id: string;

    @Column()
    name: string;

    @Column()
    department: string;

    @Column()
    contactNumber: string;

    // @Column( { type: 'tsrange', array: true, default: () => "'{}'" } ) 
    // availability: string[]; // tsrange array representing availability time slots
    // @Column( { type: 'tstzrange', array: true } )
    // availability: string[]; // tsrange array representing availability time slots
    @Column( { type: 'json', default: () => "'[]'" } )
    availability: any[];
}
