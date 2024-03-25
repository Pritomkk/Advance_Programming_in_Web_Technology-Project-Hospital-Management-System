import { IsEmail, IsString, Matches, Length, MaxLength, IsIn, IsDateString } from 'class-validator';

export class paitent_dto {
  @IsString({ message: "Name must be a string" })
  @Matches(/^[^\d]*$/, { message: "Name must not contain numbers" })
  paitentName: string;

  @IsEmail({}, { message: "Invalid email format" })
  @Length(1, 30, { message: "Email must be between 1 and 30 characters long" })
  email: string;

  @IsDateString({}, { message: "Invalid date format for admissionDate" })
  admissionDate: string | null;

  @IsString({ message: "Phone number must be a string" })
  @MaxLength(11, { message: "Phone number must not be longer than 11 digits" })
  phone: string;

  @IsIn(["male", "female"], { message: "Gender must be 'male' or 'female'" })
  gender: string;

  @IsIn(["admit"],{message:"Status must be  'admit'"})
  status:string

}


export class dischargePaitent_dto
{
  

  @IsIn(["discharge"],{message:"Status must be'discharge'"})
  status:string

  @IsDateString({}, { message: "provide valid date format for dischargeDate" })
  dischargeDate: string


}
