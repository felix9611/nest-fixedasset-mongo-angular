import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { CodeType } from './codeType.schame'
import { Model } from 'mongoose'
import { CreateCodeTypeDto, ListCodeTypeRequestDto, UpdateCodeTypeDto } from './codeType.dto'

@Injectable()
export class CodeTypeService {
    constructor(@InjectModel(CodeType.name) private codeTypeModel: Model<CodeType>) {}

    async findAll(): Promise<CodeType[]> {
        return this.codeTypeModel.find({
            status: 1
        }).exec();
    }

    async create(createData: UpdateCodeTypeDto) {
        const { _id, valueCode, valueName, type } = createData

        const checkData = await this.codeTypeModel.findOne({ valueCode, valueName, type, status: 1})

        if (checkData) {
            return {
                msg: 'This code type already exist!'
            }
        } else {
            const finalData = {
                valueCode, 
                valueName, 
                type,
                status: 1,
                createdAt: new Date()
            }

            const create = new this.codeTypeModel(finalData)
            return await create.save()
        }
    }

    async update(updateData: UpdateCodeTypeDto) {
        const { _id, ...data } = updateData

        const checkData = await this.codeTypeModel.findOne({ _id })

        if (checkData?.status === 0) {
            return {
                msg: 'This code type has been invalidated! Please contact admin!'
            }
        } else {
            const finalData = {
                ...data,
                updatedAt: new Date()
            }

            return await this.codeTypeModel.updateOne({ _id}, finalData)
        }
    }

    async getOneById(_id: string) {
        const data = await this.codeTypeModel.findOne({ _id, status: 1})

        if (data) {
            return data
        } else {
            return {
                msg: 'This code type has been invalidated! Please contact admin!'
            }
        }
    }

    async invalidateDepartment(_id: string) {
        const checkData = await this.codeTypeModel.findOne({ _id })

        if (checkData?.status === 0) {
            return {
                msg: 'This code type has been invalidated! Please contact admin!'
            }
        } else {
            const res = await this.codeTypeModel.updateOne({ _id}, {
                status: 0,
                updateAt: new Date()
            })
        
            if (res.modifiedCount === 1) {
                return {
                  msg: 'Invalidate successfully!'
                }
            } else {
                return {
                  msg: 'Ooops! Something went wrong! Please try again!'
                }
            }
        }
    }

    async listPageRole(request: ListCodeTypeRequestDto) {
            const { page, limit, name } = request
    
            const skip = (page - 1) * limit
    
            const filters = {
                $or: [
                    {
                        valueName: { $regex: name, $options: 'i' }
                    },
                    {
                        valueName: { $regex: name, $options: 'i' }
                    },
                    {
                        type: { $regex: name, $options: 'i' }
                    }
                ],
                status: 1
            }
    
            const users = await this.codeTypeModel.find(filters).skip(skip)
                .limit(limit)
                .exec()
            const total = await this.codeTypeModel.countDocuments()
    
            return {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                data: users,
            }
    }
}