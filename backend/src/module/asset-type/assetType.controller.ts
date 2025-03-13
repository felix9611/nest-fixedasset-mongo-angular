import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { AssetTypeService } from './assetType.service'
import { AssetTypeBody, AssetTypeCreateDto, AssetTypeListSearchDto, AssetTypeUpdateDto, AssetTypeQuery, CreateAssetTypeBody, ListAssetTypeQueryRes, UpdateAssetTypeBody } from './assetType.dto'
import { AuthGuard } from '../auth/AuthGuard'
import { ReturnMsg } from 'src/tool/open-api-body'
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger'

@Controller('asset/type')
export class AssetTypeController {
  constructor(private readonly assetTypeService: AssetTypeService) {}

  @ApiOperation({ summary: 'Create Asset Type' })
  @ApiBody({ description: 'Create Asset Type', type: CreateAssetTypeBody })
  @ApiResponse({ description: 'If save successful', status: 201, type: AssetTypeBody  })
  @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
  @Post('create')
  @UseGuards(AuthGuard)
  async create(@Body() createData: AssetTypeUpdateDto) {
    return this.assetTypeService.create(createData)
  }

  @ApiOperation({ summary: 'Update Asset Type' })
  @ApiBody({ type: UpdateAssetTypeBody })
  @ApiResponse({ description: 'If not save successful', status: 200, type: ReturnMsg })
  @Post('update')
  @UseGuards(AuthGuard)
  async update(@Body() createData: AssetTypeUpdateDto) {
    return this.assetTypeService.update(createData)
  }

  @ApiOperation({ summary: 'Get one data by id'})
  @ApiResponse({ description: 'If successful', status: 201, type: AssetTypeBody })
  @ApiResponse({ description: 'If not successful', status: 200, type: ReturnMsg })
  @Get('one/:id')
  async getOneById(@Param('id') id: string) {
    return await this.assetTypeService.getOneById(id)
  }

  @ApiOperation({ summary: 'Get all data'})
  @ApiResponse({ description: 'If successful', status: 201, type: [AssetTypeBody] })
  @Get('getAll')
  @UseGuards(AuthGuard)
  async getAll() {
    return this.assetTypeService.findAll()
  }

  @ApiOperation({ summary: 'Page and list'})
  @ApiBody({ type: AssetTypeQuery })
  @ApiResponse({ description: 'If successful', status: 201, type: ListAssetTypeQueryRes })
  @Post('list')
  @UseGuards(AuthGuard)
  async listAndPage(@Body() req: AssetTypeListSearchDto) {
    return this.assetTypeService.listAssetTypeBySearch(req)
  }

  @ApiOperation({ summary: 'Void data by Id'})
  @ApiResponse({ description: 'Return message only', status: 200, type: ReturnMsg })
  @Get('remove/:id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    return this.assetTypeService.voidOne(id)
  }
}