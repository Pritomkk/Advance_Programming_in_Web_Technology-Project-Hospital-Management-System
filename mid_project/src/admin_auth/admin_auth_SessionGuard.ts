import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminSessionGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!(request.session && request.session.email)) {
      throw new UnauthorizedException('Session not active');
    }
    return true;
  }
  async generateJwtToken(email: string): Promise<string> {
    const payload = { email };
    return this.jwtService.signAsync(payload);
  }
}
