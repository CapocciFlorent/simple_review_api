import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

@Entity()
export class Review {

  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ type: 'longtext' })
  @IsNotEmpty()
  textReview: string;

  @Column({ default: '' })
  typeOfWork: string;

  @Column()
  location: string;

  @Column({ default: 5 })
  @IsNotEmpty()
  rating: number;

  @Column({ default: false })
  @IsNotEmpty()
  isVerify: boolean;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  public toResponse = ({
    firstName,
    lastName,
    email,
    textReview,
    location,
    rating,
    id,
    typeOfWork,
    isVerify,
    createdAt,
    updatedAt,
  }) => ({
    firstName,
    lastName,
    email,
    textReview,
    location,
    rating,
    id,
    typeOfWork,
    isVerify,
    createdAt,
    updatedAt,
  });
}
