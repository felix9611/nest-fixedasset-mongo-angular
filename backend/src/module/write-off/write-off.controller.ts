import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { WriteOffService } from './write-off.service'
import { CreateListWriteOffRecordBody, CreateWriteOffRecrod, ListWriteOffReqBody, ListWriteOffReqDto, WriteOffQueryRes, WriteOffRecordBody } from './write-off.dto'
import { AuthGuard } from '../auth/AuthGuard'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ReturnMsg } from 'src/tool/open-api-body'

@Controller('aaset/write-off')
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

    @ApiOperation({ summary: 'Page and list'})
      @ApiBody({ type: ListWriteOffReqBody })
      @ApiResponse({ description: 'If successful', status: 201, type: WriteOffQueryRes })
    @Post('list')
    @UseGuards(AuthGuard)
    async list(@Body() query: ListWriteOffReqDto) {
        return await this.writeOffService.listAndPage(query)
    }
}