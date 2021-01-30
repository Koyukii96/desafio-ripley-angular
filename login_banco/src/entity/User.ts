import {Entity, PrimaryGeneratedColumn, Column, Unique, CreateDateColumn, UpdateDateColumn} from "typeorm"; 
import {MinLength, IsNotEmpty, IsEmail} from 'class-validator';
import * as bcrypt from 'bcryptjs';

//TODO EMAIL
@Entity()
@Unique(["username"])
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @MinLength(11)
    @IsEmail()
    @IsNotEmpty()
    username: string;

    @Column()
    @MinLength(6)
    @IsNotEmpty()
    password: string;

    @Column()
    @IsNotEmpty()
    role: string;

    @Column()
    @CreateDateColumn()
    fechaCreacion: Date;

    @Column()
    @UpdateDateColumn()
    fechaModificacion: Date;

    hashPassword(): void{
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }

    checkPassword(password: string):boolean{
        return bcrypt.compareSync(password, this.password)
    }

}
