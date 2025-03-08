import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Vendor } from './vendor.schame'
import { Model } from 'mongoose'
import { CreateVendorDto, ListVendorRequestDto, UpdateVendorDto } from './vendor.dto';

@Injectable()
export class VendorService {
    constructor(@InjectModel(Vendor.name) private vendorModel: Model<Vendor>) {}

    async findAll(): Promise<Vendor[]> {
        return this.vendorModel.find({
            status: 1
        }).exec();
    }

    async create(createData: CreateVendorDto) {
        const { vendorCode, vendorName, ..._data } = createData

        const checkData = await this.vendorModel.findOne({ vendorCode, vendorName, status: 1})

        if (checkData) {
            return {
                msg: 'This vendor already exist!'
            }
        } else {
            const finalData = {
                ...createData,
                vendorCode, 
                vendorName,
                status: 1,
                createdAt: new Date()
            }

            const create = new this.vendorModel(finalData)
            return await create.save()
        }
    }

    async update(updateData: UpdateVendorDto) {
        const { _id, ...data } = updateData

        const checkData = await this.vendorModel.findOne({ _id })

        if (checkData?.status === 0) {
            return {
                msg: 'This vendor has been invalidated! Please contact admin!'
            }
        } else {
            const finalData = {
                ...data,
                updatedAt: new Date()
            }

            return await this.vendorModel.updateOne({ _id}, finalData)
        }
    }

    async getOneById(_id: string) {
        const data = await this.vendorModel.findOne({ _id, status: 1})

        if (data) {
            return data
        } else {
            return {
                msg: 'This vendor has been invalidated! Please contact admin!'
            }
        }
    }

    async invalidateDepartment(_id: string) {
        const checkData = await this.vendorModel.findOne({ _id })

        if (checkData?.status === 0) {
            return {
                msg: 'This vendor has been invalidated! Please contact admin!'
            }
        } else {
            const res = await this.vendorModel.updateOne({ _id}, {
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

    async listPageRole(request: ListVendorRequestDto) {
            const { page, limit, name, place, contact } = request
    
            const skip = (page - 1) * limit
    
            const filters = {
                ...name ? {
                    $or: [
                        {
                            vendorName: { $regex: name, $options: 'i' }
                        },
                        {
                            vendorCode: { $regex: name, $options: 'i' }
                        },
                        {
                            contactPerson: { $regex: name, $options: 'i' }
                        }
                    ]
                } : {},
                ...place ? {
                    address: { $regex: place, $options: 'i' }
                } : {},
                ...contact ? {
                    $or: [
                        {
                            email: { $regex: contact, $options: 'i' }
                        },
                        {
                            phone: { $regex: contact, $options: 'i' }
                        },
                        {
                            fax: { $regex: contact, $options: 'i' }
                        }
                    ]
                } : {},
                status: 1
            }
    
            const users = await this.vendorModel.find(filters).skip(skip)
                .limit(limit)
                .exec()
            const total = await this.vendorModel.countDocuments()
    
            return {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                data: users,
            }
    }
}