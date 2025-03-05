import { Injectable, UnauthorizedException } from '@nestjs/common'
import { SysUserService } from '../sys-user/sysUser.service'
import { JwtService } from '@nestjs/jwt'
import { hashPassword, salt } from 'src/tool/password-tools'

@Injectable()
export class AuthService {
    constructor(
        private usersService: SysUserService,
        private jwtService: JwtService
    ) {}

  async signIn(
    username: string,
    password: string,
  ): Promise<{ accessToken: string }> {
    const user = await this.usersService.findOneUser(username)

    const passwordString = hashPassword(password, salt)

    if (user?.password !== passwordString) {
      throw new UnauthorizedException()
    }
    const payload = { sub: user._id, username: user.username };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    }
  }
  
}
