import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { SysUserService } from './sysUser.service'
import { CreateUserRequestDto, CreateUserDto } from './sysUser.dto'
import { AuthGuard } from '../auth/AuthGuard'

@Controller('sys/user')
export class SysUserController {
    constructor(private readonly userService: SysUserService) {}

    @Post('create-user')
    async createUser(@Body() createUserRequest: CreateUserRequestDto) {
        return await this.userService.createUser(createUserRequest);
    }

    @Post('update-uesr/:id')
    @UseGuards(AuthGuard)
    async updateUser(@Body() updateRequesr: CreateUserDto, @Param('id') id: string) {
        return await this.userService.updateUser(id, updateRequesr)
    }

    @Post('update-password')
    @UseGuards(AuthGuard)
    async updatePassword(@Body() updatePw: { password: string, username: string}) {
        return await this.userService.updatePassword(updatePw.username, updatePw.password)
    }

    @Delete('invalidate-user/:id')
    async invalidateUser(@Param('id') id: string) {
        return await this.userService.invalidateUser(id)
    }
}