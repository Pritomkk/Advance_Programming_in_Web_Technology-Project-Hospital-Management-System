import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AdminAuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Token not provided');
    }

    try {
      const decoded = this.jwtService.verify(token);
      req.user = decoded; 
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
