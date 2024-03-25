import { AdminService } from './admin_auth.service';
import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, Request, Res, UploadedFile, UseInterceptors, UsePipes, ValidationPipe, Session, UseGuards, HttpException, HttpStatus, UnauthorizedException, Req, Delete } from "@nestjs/common";
import {AdminSignInDTO,AdminSignUpDTO,AdminUpdateDTO, uploadAdminPictureDTO} from "./admin_auth.dto/admin_auth.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { MulterError, diskStorage } from "multer";
import { AdminSessionGuard } from './admin_auth_SessionGuard';
import { AdminAuthMiddleware } from './admin_auth.middleware';
import { AdminEntity } from './admin_auth_entity/admin_entity';
import { adminProfile } from './admin_auth_entity/adminProfile_entity';

@Controller('admin')
@UseGuards(AdminAuthMiddleware)
export class AdminController {

    constructor(private readonly adminService: AdminService) { }
/////////////////////////////////////////////////////////
    @UsePipes(new ValidationPipe)
    @Post("/SignUp")
    signup(@Body() mydata: AdminSignUpDTO) {
        console.log(mydata);
        return this.adminService.signup(mydata);
    }

   /* @Post(('/upload'))
    @UseInterceptors(FileInterceptor('myfile',
        {
            fileFilter: (req, file, cb) => {
                if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/))
                    cb(null, true);
                else {
                    cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
                }
            },
            limits: { fileSize: 30000 },
            storage: diskStorage({
                destination: './uploads',
                filename: function (req, file, cb) {
                    cb(null, Date.now() + file.originalname)
                },
            })
        }
    ))

    uploadFile(@UploadedFile() myfileobj: Express.Multer.File): object {
        console.log(myfileobj)
        return ({ message: "file uploaded" });
    }*/

////////////////////////////////////////////////
@Post('/updateAdminPicture')
@UseInterceptors(FileInterceptor('myfile', {
    fileFilter: (req, file, cb) => {
        if (file.originalname.match(/^.*\.(jpg|webp|png|jpeg)$/)) {
            cb(null, true);
        } else {
            cb(new MulterError('LIMIT_UNEXPECTED_FILE', 'image'), false);
        }
    },
    limits: { fileSize: 90000 },
    storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
            cb(null, Date.now() + file.originalname);
        },
    }),
}))
async uploadFile2(
    @UploadedFile() myfileobj: Express.Multer.File,
    @Session() session,
): Promise<any> {
    try {
        // Assuming session contains email
        const sessionEmail: string = session.email;

        if (!myfileobj || !myfileobj.filename) {
            throw new Error('File not uploaded or file name not provided');
        }

        await this.adminService.uploadAdminPicture(sessionEmail, myfileobj);

        return { message: "File uploaded and admin profile updated" };
    } catch (error) {
        throw new Error(`Failed to update admin profile: ${error.message}`);
    }
}


////////////////////////
/*
    @Get('/getimage/:name')
    getImages(@Param('name') name, @Res() res) {
        res.sendFile(name, { root: './uploads' })
    } */

///////////////
@Post('/signin')
  async signin(@Body() credentials: AdminSignInDTO, @Session() session): Promise<{ access_token: string; message: string; }> {
    try {
      const token = await this.adminService.signin(credentials, session);
      return { access_token: token, message: "Successfully signed in" };
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }
////////////////////
@UseGuards(AdminSessionGuard)
@Post('/signout')
    signout( @Req() req) {
        if (req.session.destroy()) {
            return{message:"Sucessfully Signout"};
        }
        else {
            throw new UnauthorizedException("invalid actions");
        }
    }
////////////////////////
@UseGuards(AdminSessionGuard)
@Get('getimagebyemail')
    async getImageByEmail(@Session() session, @Res() res) {
        const sessionEmail = session.email;
        const filename = await this.adminService.getImageByEmail(sessionEmail);
        res.sendFile(filename, { root: './uploads' });
    }
/////////////////////////////

@Get('/index')
    getIndex(): any {
        return this.adminService.getIndex();
    }
///////////////////////////
    @UseGuards(AdminSessionGuard)
    @Get('/search/:Adminid')
    async getAdminById(@Param('Adminid', ParseIntPipe) AdminId: number): Promise<AdminEntity> {
        const res = await this.adminService.getAdminById(AdminId);
        if (res !== null) {
            return await this.adminService.getAdminById(AdminId);
        }
        else {
            throw new HttpException("Admin not found", HttpStatus.NOT_FOUND);
        }
    }
////////////////////////////

/////////////////////////
@UseGuards(AdminSessionGuard)
@Put('/updateadmin')
@UsePipes(new ValidationPipe())
async updateAdminBySession(@Body() data:AdminUpdateDTO, @Session() session): Promise<any> {
    try {
        const result = await this.adminService.updateAdminBySession(session.email, data);
        return { success: true, message: result.message };
    } catch (error) {
        return { success: false, error: error.message };
    }
}


////////////////////////////
@UseGuards(AdminSessionGuard)
@Get('adminProfile')
async getAdminWithAdminProfile(@Session() session): Promise<adminProfile> {
    try {
        const sessionEmail: string = session.email;
        const adminWithProfile = await this.adminService.getAdminProfileByEmail(sessionEmail);
        return adminWithProfile;
    } 
    catch (error) {
        // Handle errors
        throw new Error('Failed to retrieve admin with profile.');
    }
}

////////////////////////

@UseGuards(AdminSessionGuard)
@Delete('deleteAdminProfile')
    async deleteAdminProfile(@Session() session): Promise<{ message: string }> {
        try {
            const sessionEmail: string = session.email;
            await this.adminService.deleteAdminProfileByEmail(sessionEmail);
            return { message: 'Admin profile deleted successfully' };
        } catch (error) {
            // Handle error if admin profile with session email does not exist or deletion fails
            return { message: 'Failed to delete admin profile' };
        }
    }

//////////////////////////////////////////
    @UseGuards(AdminSessionGuard)
    @Post('sendmail')
    async sendmail() {
    return await this.adminService.sendmail();
  }



}