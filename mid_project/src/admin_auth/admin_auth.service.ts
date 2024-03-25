import { Injectable, NotFoundException, Session, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindOneOptions, Repository } from "typeorm";
import * as bcrypt from 'bcrypt'
import { MailerService } from "@nestjs-modules/mailer/dist";
import { AdminSignInDTO, AdminSignUpDTO, AdminUpdateDTO, uploadAdminPictureDTO } from "./admin_auth.dto/admin_auth.dto";
import { JwtService } from "@nestjs/jwt";
import { session } from "passport";
import { AdminEntity } from "./admin_auth_entity/admin_entity";
import { adminProfile } from "./admin_auth_entity/adminProfile_entity";


@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(AdminEntity)
        private adminRepository: Repository<AdminEntity>,
        @InjectRepository(adminProfile)
        private readonly adminProfileRepository: Repository<adminProfile>,
        private readonly mailobject: MailerService,
        private readonly jwtService: JwtService,
    ) {}

    async signup(data: AdminSignUpDTO): Promise<{ admin: AdminEntity; message: string }> {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(data.password, salt);
    
        const admin = new AdminEntity();
        admin.name = data.name;
        admin.email = data.email;
        admin.password = hashedPassword;
        admin.date = data.date;
        admin.phone = data.phone;
        admin.gender = data.gender;
    
        
        const adminProfileInstance = new adminProfile();
        adminProfileInstance.name = data.name;
        adminProfileInstance.email = data.email;
        adminProfileInstance.gender = data.gender;
        adminProfileInstance.admin = admin;
    
        await this.adminProfileRepository.save(adminProfileInstance);
        const newAdmin = await this.adminRepository.save(admin);
    
        return {
            admin: newAdmin,
            message: "Signup successful",
        };
    }
////////////////////////////////////
    async uploadAdminPicture(sessionEmail: string, file: Express.Multer.File): Promise<any> {
      const admin = await this.adminRepository.findOne({ where: { email: sessionEmail } });
      if (!admin) {
          throw new Error('Admin not found');
      }

      const adminProfile = await this.adminProfileRepository.findOne({ where: { email: sessionEmail } });
      if (!adminProfile) {
          throw new Error('Admin profile not found');
      }

      admin.profilePicture = file.filename; // Assuming 'filename' contains the name of the uploaded file
      await this.adminRepository.save(admin);
  }

/////////////////////////
  
async getImageByEmail(email: string): Promise<string> {
  const adminData = await this.adminRepository.findOne({ where: { email: email } });
  if (!adminData) {
      throw new NotFoundException('Admin not found');
  }
  return adminData.profilePicture;
}

//////////////////////////////////////////
    async signin(credentials: AdminSignInDTO, session): Promise<string> {
        const { email, password } = credentials;
        const user = await this.adminRepository.findOne({ where: { email } });
      
        if (!user) {
          throw new UnauthorizedException('Invalid email or password.');
        }
      
        const isPasswordValid = await bcrypt.compare(password, user.password);
      
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid email or password.');
        }
      
        // Set the email in the session
        session.email = user.email;
        console.log(session.email);
      
        const payload = { email: user.email };
        return this.jwtService.sign(payload);
      }
      
//////////////////////////////////////////Update Both 
      async updateAdminBySession(sessionEmail: string, data:AdminUpdateDTO): Promise<any> {
        const admin = await this.adminRepository.findOne({ where: { email: sessionEmail } });
        if (!admin) {
            throw new Error('Admin not found');
        }

        const adminProfile = await this.adminProfileRepository.findOne({ where: { email: sessionEmail } });
        if (!adminProfile) {
            throw new Error('Admin profile not found');
        }

        // Update AdminEntity
        admin.name = data.name;
        admin.email = data.email;
        admin.gender = data.gender;
        
        await this.adminRepository.save(admin);

        // Update adminProfile
        adminProfile.name = data.name;
        adminProfile.email = data.email;
        adminProfile.gender = data.gender;

        await this.adminProfileRepository.save(adminProfile);

        return { message: 'Admin information updated successfully' };
    }
    
////All /////////////////////////////////
  async getIndex(): Promise<AdminEntity[]> {
      return this.adminRepository.find();
  }

  //////////////////////
  async getAdminProfileByEmail(email: string): Promise<adminProfile> {
    try {
        const adminProfile = await this.adminProfileRepository.findOne({
            where: { email },
            relations: ['admin'],
        });
        if (!adminProfile) {
            throw new Error('Admin profile not found');
        }
        return adminProfile;
    } catch (error) {
        throw new Error('Failed to retrieve admin profile by email');
    }
}
//////////////////////
  async getAdminById(Adminid: number): Promise<AdminEntity> {
      return this.adminRepository.findOneBy({Adminid});
  }
/////////////////
  async getAdminByEmail(email: string): Promise<AdminEntity> {
      return this.adminRepository.findOneBy({ email: email });
  }

////////////////////////
  async getAdminbyIDAndName(id, name): Promise<AdminEntity> {
      return this.adminRepository.findOneBy({ Adminid: id, name: name });
  }
///////////////////////
 async deleteAdminProfileByEmail(email: string): Promise<void> {
        const adminProfile = await this.adminProfileRepository.findOne({ where: { email }});
        const admin = await this.adminRepository.findOne({ where: { email }})
        if (!adminProfile) {
            throw new Error('Admin profile not found');
        }
        await this.adminProfileRepository.remove(adminProfile);
        await this.adminRepository.remove(admin);
    }
//////////////////////////////////
async sendmail() {

        return await this.mailobject.sendMail({
            from:{name:"pritom",address:'pritom@gmail.com'},
             to:{name:"dey",address:'dey@gmail.com'},
            subject: 'For test purpose',
            text: 'yeah  finnaly this code work ',
        });

    }


}