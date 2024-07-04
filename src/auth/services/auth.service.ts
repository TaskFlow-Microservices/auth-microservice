import { lastValueFrom } from 'rxjs';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from '../dto/register.dto';
import { JwtPayload } from '../interfaces/payload.interface';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly client: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(args: RegisterDto) {
    try {
      const user = await lastValueFrom(this.client.send('create_user', args));

      const payload: JwtPayload = {
        username: user.username,
        sub: user.uuid,
      };

      const token = this.jwtService.sign(payload);
      return {
        status: 'ok',
        token,
      };
    } catch (error) {
      throw new RpcException(error);
    }
  }

  async login(args: LoginDto) {
    try {
      const user = await lastValueFrom(
        this.client.send('find_user_by_email', args.email),
      );

      if (!user) {
        throw new RpcException('User not found');
      }

      const isMatch = bcrypt.compareSync(args.password, user.password);

      if (!isMatch) {
        throw new BadRequestException('Invalid credentials');
      }

      const payload: JwtPayload = {
        username: user.username,
        sub: user.uuid,
      };

      const token = this.jwtService.sign(payload);

      return {
        status: 'ok',
        token,
      };
    } catch (error) {
      console.log('Error en el catch de login', error);

      throw new RpcException(error);
    }
  }
}
