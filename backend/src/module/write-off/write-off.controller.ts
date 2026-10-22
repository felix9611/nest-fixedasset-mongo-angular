import { Body, Controller, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common'
import { WriteOffService } from './write-off.service'
import { CreateListWriteOffRecordBody, CreateWriteOffRecrod, ListWriteOffReqBody, ListWriteOffReqDto, WriteOffQueryRes, WriteOffRecordBody, WriteOffRecordFullBody } from './write-off.dto'
import { AuthGuard } from '../auth/AuthGuard'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ReturnMsg } from 'src/tool/open-api-body'
import { JwtPayload } from '../auth/auth.dto'

@Controller('asset/write-off')
export class WriteOffController {
    constructor(private writeOffService: WriteOffService) {}

    @ApiOperation({ summary: 'Create Write Off Record' })
    @ApiBody({ type: CreateListWriteOffRecordBody })
    @ApiResponse({ description: 'If save successful', status: 201, type: WriteOffRecordBody })
    @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: CreateWriteOffRecrod) {
        return await this.writeOffService.create(createData)
    }

    @ApiOperation({ summary: 'List with filter'})
    @ApiBody({ type: ListWriteOffReqBody })
    @ApiResponse({ description: 'If successful', status: 201, type: [WriteOffRecordFullBody] })
    @Post('filter/list')
    @UseGuards(AuthGuard)
    async listWithFilter(@Body() query: ListWriteOffReqDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
             return await this.writeOffService.listWithFilter(query)
        } else {
            if ((query.placeIds ?? []).some(placeId => !user.placeIds.includes(placeId))) {
                throw new HttpException({ message: 'Location access denied' }, HttpStatus.FORBIDDEN)
            } else {
                 return await this.writeOffService.listWithFilter(query)
            }
        }
    }

    @ApiOperation({ summary: 'Page and list'})
    @ApiBody({ type: ListWriteOffReqBody })
    @ApiResponse({ description: 'If successful', status: 201, type: WriteOffQueryRes })
    @Post('list')
    @UseGuards(AuthGuard)
    async list(@Body() query: ListWriteOffReqDto, @Req() { user }: { user: JwtPayload }) {
        if (user.superAdmin === true) {
            return await this.writeOffService.listAndPage(query)
        } else {
            if ((query.placeIds ?? []).some(placeId => !user.placeIds.includes(placeId))) {
                throw new HttpException({ message: 'Location access denied' }, HttpStatus.FORBIDDEN)
            } else {
                return await this.writeOffService.listAndPage(query)
            }
        }
    }
}