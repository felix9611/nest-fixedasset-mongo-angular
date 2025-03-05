import { Body, Controller, Get, Post } from '@nestjs/common'
import { AssetTypeService } from './assetType.service'
import { AssetTypeCreateDto } from './assetType.dto'

@Controller('asset/type')
export class AssetTypeController {
  constructor(private readonly assetTypeService: AssetTypeService) {}

  @Post('create')
  getHello(@Body() createData: AssetTypeCreateDto) {
    return this.assetTypeService.create(createData);
  }

  @Get('getAll')
  async getAll() {
    return this.assetTypeService.findAll()
  }
}