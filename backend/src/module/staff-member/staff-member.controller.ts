import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Req, UseGuards } from "@nestjs/common"
import { StaffMemberService } from "./staff-member.service"
import { ApiOperation } from "@nestjs/swagger"
import { AuthGuard } from "../auth/AuthGuard"
import { JwtPayload } from "../auth/auth.dto"
import { StaffMember } from "./staff-member.schema"
import { CreateStaffMember } from "./staff-member.dto"

@Controller('base/staff-member')
export class StaffMemberController {
    constructor(private staffMemberService: StaffMemberService){}

    @ApiOperation({ summary: 'Get one by ID' })
    @Get('one/:id')
    @UseGuards(AuthGuard)
    async getOneById(@Param('id') id: string, @Req() { user }: { user: JwtPayload }) {
        return await this.staffMemberService.getOneById(id)
    }

    @ApiOperation({ summary: 'Create Location' })
    @Post('update')
    @UseGuards(AuthGuard)
    async create(@Body() create: CreateStaffMember, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin || user.manager) {
            return await this.staffMemberService.updateStaff(create)
        } else {
                throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Update Location' })
    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() update: StaffMember, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin || user.manager) {
            return await this.staffMemberService.updateStaff(update)
        } else {
                throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }
}