import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";
import * as bcrypt from "bcryptjs";

@Entity()
@Unique(['username', 'email'])
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(4, 20)
  @IsNotEmpty()
  username: string;

  @Column()
  @Length(2, 154)
  @IsNotEmpty()
  firstName: string;

  @Column()
  @Length(2, 154)
  @IsNotEmpty()
  lastName: string;

  @Column()
  @IsNotEmpty()
  email: string;

  @Column()
  @Length(4, 100)
  @IsNotEmpty()
  password: string;

  @Column({ default: 'USER' })
  @IsNotEmpty()
  role: string;

  @Column({ default: true })
  @IsNotEmpty()
  active: boolean;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  hashPassword() {
    this.password = bcrypt.hashSync(this.password, 8);
  }

  checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
    return bcrypt.compareSync(unencryptedPassword, this.password);
  }
}
