import { Controller } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('sign-up')
  signUp(@Payload() args: RegisterDto) {
    return this.authService.signUp(args);
  }

  @MessagePattern('login')
  login(@Payload() args: LoginDto) {
    return this.authService.login(args);
  }
}
