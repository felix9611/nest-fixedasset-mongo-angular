import { Body, Controller, Post, UseGuards } from '@nestjs/common'
import { WriteOffService } from './write-off.service'
import { CreateWriteOffRecrod, ListWriteOffReqDto } from './write-off.dto'
import { AuthGuard } from '../auth/AuthGuard'

@Controller('aaset/write-off')
export class WriteOffController {
    constructor(private writeOffService: WriteOffService) {}

    @Post('create')
    @UseGuards(AuthGuard)
    async create(@Body() createData: CreateWriteOffRecrod) {
        return await this.writeOffService.create(createData)
    }

    @Post('list')
    @UseGuards(AuthGuard)
    async list(@Body() query: ListWriteOffReqDto) {
        return await this.writeOffService.listAndPage(query)
    }
}