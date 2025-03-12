import { Body, Controller, Post } from '@nestjs/common'
import { WriteOffService } from './write-off.service';
import { CreateWriteOffRecrod } from './write-off.dto';

@Controller('aaset/write-off')
export class WriteOffController {
    constructor(private writeOffService: WriteOffService) {}

    @Post('create')
    async create(@Body() createData: CreateWriteOffRecrod) {
        return await this.writeOffService.create(createData)
    }
}