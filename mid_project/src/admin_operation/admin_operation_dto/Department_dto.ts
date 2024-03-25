import { IsEmail, IsString, Matches, Length, MaxLength, IsIn, IsDateString } from 'class-validator';

export class department_dto {
  @IsString({ message: "Name must be a string" })

  @Matches(/^[^\d]*$/, { message: "Name must not contain numbers" })
  depName: string;
  
  @IsDateString({}, { message: "Invalid date format" })
  date: string| null

}
