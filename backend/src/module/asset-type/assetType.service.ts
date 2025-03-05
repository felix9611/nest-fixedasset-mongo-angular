import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { AssetType } from './assetType.schame'
import { AssetTypeCreateDto } from './assetType.dto'

@Injectable()
export class AssetTypeService {
    constructor(@InjectModel(AssetType.name) private assetTypeModel: Model<AssetType>) {}
    
    async create(createDto: AssetTypeCreateDto) {

        const checkData = await this.assetTypeModel.findOne({
            typeCode: createDto.typeCode,
            typeName: createDto.typeName
        })

        if (checkData) {
            return {
                msg: 'This type already exist!'
            }
        } else {
            const finalData = {
                ...createDto,
                createdAt: new Date(),
                status: 1
            }
            const created = new this.assetTypeModel(finalData)
            return await created.save()
        }
    }

    async findAll(): Promise<AssetType[]> {
        return this.assetTypeModel.find({
            status: 1
        }).exec();
    }
}