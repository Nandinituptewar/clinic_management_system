import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Patient {
    @PrimaryGeneratedColumn( 'uuid' )
    id: string;

    @Column()
    name: string;

    @Column()
    dateOfBirth: Date;

    @Column()
    contactNumber: string;
}
