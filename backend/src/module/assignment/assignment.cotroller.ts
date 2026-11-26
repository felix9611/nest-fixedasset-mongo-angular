import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, Req, UseGuards } from '@nestjs/common'
import { AssignmentService } from './assignment.service'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { AuthGuard } from '../auth/AuthGuard'
import { AssignedAssetReqDto, CreateAssignment } from './assignment.dto'
import { JwtPayload } from '../auth/auth.dto'
import { Assignment } from './assignment.schema'
import { ReturnMsg } from 'src/tool/open-api-body'

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

    @ApiOperation({ summary: 'Update Assign' })
    @Post('update')
    @UseGuards(AuthGuard)
    async update(@Body() create: Assignment, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin || user.manager) {
            return await this.assignmentService.updateAssign(create)
        } else {
            throw new HttpException({message: 'Access denied'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Load list with staffId' })
    @Post('list/:staffId')
    @UseGuards(AuthGuard)
    async list(@Param('staffId') staffId: string, @Body() data: AssignedAssetReqDto, @Req() { user }: { user: JwtPayload }) {
        if (staffId) {
            return await this.assignmentService.listAssignedAsset(data, staffId)
        } else {
            throw new HttpException({message: 'Must with staffId!!'}, HttpStatus.FORBIDDEN)
        }
    }

    @ApiOperation({ summary: 'Void data by Id'})
    @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
    @Delete('remove/:id')
    @UseGuards(AuthGuard)
    async remove(@Param('id') id: string, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin || user.manager) {
          return this.assignmentService.voidOne(id)
        } else {
          throw new HttpException({ message: 'Access denied' }, HttpStatus.FORBIDDEN)
        }
    }
}