import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { AssetTypeService } from './assetType.service'
import { AssetTypeCreateDto, AssetTypeListSearchDto } from './assetType.dto'
import { AuthGuard } from '../auth/AuthGuard'

@Controller('asset/type')
export class AssetTypeController {
  constructor(private readonly assetTypeService: AssetTypeService) {}

  @Post('create')
  @UseGuards(AuthGuard)
  async create(@Body() createData: AssetTypeCreateDto) {
    return this.assetTypeService.create(createData);
  }

  @Post('update')
  @UseGuards(AuthGuard)
  async update(@Body() createData: AssetTypeCreateDto) {
    return this.assetTypeService.create(createData);
  }

  @Get('one/:id')
  async getOneById(@Param('id') id: string) {
    return await this.assetTypeService.getOneById(id)
  }

  @Get('getAll')
  @UseGuards(AuthGuard)
  async getAll() {
    return this.assetTypeService.findAll()
  }

  @Post('list')
  @UseGuards(AuthGuard)
  async listAndPage(@Body() req: AssetTypeListSearchDto) {
    return this.assetTypeService.listAssetTypeBySearch(req)
  }

  @Delete('remove/:id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    return this.assetTypeService.voidOne(id)
  }
}