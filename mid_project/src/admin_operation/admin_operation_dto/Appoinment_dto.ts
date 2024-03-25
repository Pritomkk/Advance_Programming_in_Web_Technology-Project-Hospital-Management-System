import { IsDate, IsDateString, IsIn, IsNotEmpty, IsString } from 'class-validator';

export class AppointmentDto {
    @IsNotEmpty()
    @IsString({ message: "Set the appionment date" })
    appointmentDate:string;

    @IsNotEmpty()
    @IsString({ message: "Set the appionment time" })
    appointmentTime: string;

    @IsNotEmpty()
    @IsIn(["Active"], { message: "Please set status Active " })
    appointmentStatus: string;

    @IsNotEmpty({ message: "set paitent appionment serial" })
    paitentAppionmentSerial: number;
}