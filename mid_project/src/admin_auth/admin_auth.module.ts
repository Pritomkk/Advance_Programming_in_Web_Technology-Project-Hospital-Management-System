import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin_auth.controller';
import { AdminService } from './admin_auth.service';
import { MailerModule} from '@nestjs-modules/mailer';
import { JwtModule } from '@nestjs/jwt';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AdminAuthMiddleware } from './admin_auth.middleware';
import { PassportModule } from '@nestjs/passport';
import { AdminEntity } from './admin_auth_entity/admin_entity';
import { adminProfile } from './admin_auth_entity/adminProfile_entity';

  @Module({
      imports: [
        TypeOrmModule.forFeature([AdminEntity,adminProfile]),
        JwtModule.register({
        secret: 'Kiddo&Fugi(pritom)',
        signOptions: { expiresIn: '20min' }, 
      }),
        MailerModule.forRoot({
          transport: {
              host: 'sandbox.smtp.mailtrap.io',
              port: 465,
              secure:false,
              auth: {
                  user: 'b0a06d86994d27',
                  pass: 'd4a0b3a7dffad5'
              },
          }
      })
      ],
      providers: [AdminService],
      controllers: [AdminController],
      exports: [AdminService],
    })
    export class AdminAuthModule implements NestModule {
      configure(consumer: MiddlewareConsumer) {
          consumer
              .apply(AdminAuthMiddleware)
              .exclude(
                  { path: 'admin/signin', method: RequestMethod.POST },
                  { path: 'admin/signup', method: RequestMethod.POST },
                  { path: 'admin/signout', method: RequestMethod.POST },
              

              )
              .forRoutes('admin'); //  middleware to 'admin' routes
        
      }
  }
