import { Body, Controller, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common'
import { AssignmentService } from './assignment.service'
import { ApiOperation } from '@nestjs/swagger'
import { AuthGuard } from '../auth/AuthGuard'
import { CreateAssignment } from './assignment.dto'
import { JwtPayload } from '../auth/auth.dto'

@Controller('asset/assignment')
export class AssignmentController {
    constructor(
        private assignmentService: AssignmentService,
    ) {}

    @ApiOperation({ summary: 'Create Assign' })
    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() create: CreateAssignment, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin || user.manager) {
            return await this.assignmentService.createAssign(create, user)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }
}