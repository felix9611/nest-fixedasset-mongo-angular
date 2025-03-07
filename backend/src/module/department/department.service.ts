import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Department } from './department.schame'
import { Model } from 'mongoose'
import { CreateDeptDto, ListDeptRequestDto, UpdateDeptDto } from './department.dto';

@Injectable()
export class DepartmentService {
    constructor(@InjectModel(Department.name) private departmentModel: Model<Department>) {}

    async findAll(): Promise<Department[]> {
        return this.departmentModel.find({
            status: 1
        }).exec();
    }

    async create(createData: CreateDeptDto) {
        const { deptCode, deptName, ..._data } = createData

        const checkData = await this.departmentModel.findOne({ deptCode, deptName, status: 1})

        if (checkData) {
            return {
                msg: 'This department already exist!'
            }
        } else {
            const finalData = {
                ...createData,
                deptCode,
                deptName,
                status: 1,
                createdAt: new Date()
            }

            const create = new this.departmentModel(finalData)
            return await create.save()
        }
    }

    async update(updateData: UpdateDeptDto) {
        const { _id, ...data } = updateData

        const checkData = await this.departmentModel.findOne({ _id })

        if (checkData?.status === 0) {
            return {
                msg: 'This department has been invalidated! Please contact admin!'
            }
        } else {
            const finalData = {
                ...data,
                updatedAt: new Date()
            }

            return await this.departmentModel.updateOne({ _id}, finalData)
        }
    }

    async getOneById(_id: string) {
        const data = await this.departmentModel.findOne({ _id, status: 1})

        if (data) {
            return data
        } else {
            return {
                msg: 'This role has been invalidated! Please contact admin!'
            }
        }
    }

    async invalidateDepartment(_id: string) {
        const checkData = await this.departmentModel.findOne({ _id })

        if (checkData?.status === 0) {
            return {
                msg: 'This role has been invalidated! Please contact admin!'
            }
        } else {
            const res = await this.departmentModel.updateOne({ _id}, {
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

    async listPageRole(request: ListDeptRequestDto) {
            const { page, limit, name } = request
    
            const skip = (page - 1) * limit
    
            const filters = {
                $or: [
                    {
                        deptName: { $regex: name, $options: 'i' }
                    },
                    {
                        deptCode: { $regex: name, $options: 'i' }
                    }
                ],
                status: 1
            }
    
            const users = await this.departmentModel.find(filters).skip(skip)
                .limit(limit)
                .exec()
            const total = await this.departmentModel.countDocuments()
    
            return {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                data: users,
            }
    }
}