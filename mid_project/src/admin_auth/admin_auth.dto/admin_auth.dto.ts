import { IsEmail, IsEmpty, IsNotEmpty, IsString, Matches,Length,IsDateString,MaxLength,IsIn, isNotEmpty} from 'class-validator';

export class AdminSignUpDTO {
    @IsNotEmpty()
    @IsString({ message: "Name must be a string" })
    @Matches(/^[^\d]*$/, { message: "Name must not contain numbers" })
    name: string;

    @IsEmail({}, { message: "Invalid email format" })
    @Length(1, 30, { message: "Email must be between 1 and 30 characters long" })
    email: string;

    @IsString({ message: "Password must be a string" })
    @Matches(/^(?=.*[@#$&])[A-Za-z\d@#$&]+$/, { message: "Password must contain at least one of the special characters '@', '#', '$', or '&'" })
    password: string;

    @IsDateString({}, { message: "Invalid date format" })
    date: string;

    @IsString({ message: "Phone number must be a string" })
    @MaxLength(11, { message: "Phone number must not be longer than 11 digits" })
    phone: string;

    @IsIn(["male", "female"], { message: "Gender must be 'male' or 'female'" })
    gender: string;
 
    profilePicture: string;

}

export class uploadAdminPictureDTO{

    
    @IsString({ message: "Profile picture filename must be a string" })
    @Matches(/\.(jpg|jpeg)$/i, { message: "Profile picture must have a JPG or JPEG extension" })
    profilePicture: string;
    
}



export class AdminSignInDTO {
    @IsNotEmpty({ message: "Provide the register email" })
    email: string;
    @IsNotEmpty({ message: "Provide the register Password" })
    password: string;
}

export class AdminUpdateDTO {
 
    @IsString({ message: "Name must be a string" })
    @Matches(/^[^\d]*$/, { message: "Name must not contain numbers" })
    name: string;

    @IsEmail({}, { message: "Invalid email format" })
    @Length(1, 30, { message: "Email must be between 1 and 30 characters long" })
    email: string;

    @IsIn(["male", "female"], { message: "Gender must be 'male' or 'female'" })
    gender: string;
    
}

