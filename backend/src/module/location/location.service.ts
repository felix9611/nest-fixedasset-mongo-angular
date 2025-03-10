import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Location } from './location.schame'
import { Model } from 'mongoose'
import { CreateLocationDto, ListLocationRequestDto, UpdateLocationDto } from './location.dto';
import { ActionRecordService } from '../action-record/actionRecord.service';

@Injectable()
export class LocationService {
    constructor(
        @InjectModel(Location.name) private locationModel: Model<Location>,
        private actionRecordService: ActionRecordService
    ) {}

    async findAll(): Promise<Location[]> {
        return this.locationModel.find({
            status: 1
        }).exec();
    }

    async create(createData: UpdateLocationDto) {
        const { _id, placeCode, placeName, ..._data } = createData

        const checkData = await this.locationModel.findOne({ placeCode, placeName, status: 1})

        if (checkData) {
            return {
                msg: 'This location already exist!'
            }
        } else {
            const finalData = {
                ...createData,
                placeCode, 
                placeName,
                status: 1,
                createdAt: new Date()
            }

            const create = new this.locationModel(finalData)
            return await create.save()
        }
    }

    async update(updateData: UpdateLocationDto) {
        const { _id, ...data } = updateData

        const checkData = await this.locationModel.findOne({ _id })

        if (checkData?.status === 0) {
            return {
                msg: 'This location has been invalidated! Please contact admin!'
            }
        } else {
            const finalData = {
                ...data,
                updatedAt: new Date()
            }

            return await this.locationModel.updateOne({ _id}, finalData)
        }
    }

    async getOneById(_id: string) {
        const data = await this.locationModel.findOne({ _id, status: 1})

        if (data) {
            return data
        } else {
            return {
                msg: 'This location has been invalidated! Please contact admin!'
            }
        }
    }

    async invalidateDepartment(_id: string) {
        const checkData = await this.locationModel.findOne({ _id })

        if (checkData?.status === 0) {
            return {
                msg: 'This location has been invalidated! Please contact admin!'
            }
        } else {
            const res = await this.locationModel.updateOne({ _id}, {
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

    async listPageRole(request: ListLocationRequestDto) {
            const { page, limit, name } = request
    
            const skip = (page - 1) * limit
    
            const filters = {
                ... name ? {
                    $or: [
                        {
                            placeName: { $regex: name, $options: 'i' }
                        },
                        {
                            placeName: { $regex: name, $options: 'i' }
                        }
                    ],
                } : {},
                status: 1
            }
    
            const lists = await this.locationModel.find(filters).skip(skip)
                .limit(limit)
                .exec()
            const total = await this.locationModel.countDocuments()
    
            return {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                lists
            }
    }
}