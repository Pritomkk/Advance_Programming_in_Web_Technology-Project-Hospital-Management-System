import { IsEmail, IsString, Matches, Length, MaxLength, IsIn, IsDateString, IsNumber } from 'class-validator';

export class doctor_profile_dto {
  @IsString({ message: "Name must be a string" })
  @Matches(/^[^\d]*$/, { message: "Name must not contain numbers" })
  doctorName: string;

  @IsEmail({}, { message: "Invalid email format" })
  @Length(1, 30, { message: "Email must be between 1 and 30 characters long" })
  email: string;

  @IsString({ message: "Phone number must be a string" })
  @MaxLength(11, { message: "Phone number must not be longer than 11 digits" })
  phone: string;

  @IsIn(["male", "female"], { message: "Gender must be 'male' or 'female'" })
  gender: string;

  @IsNumber()
  maxCheekUpPaitent:number;

}
