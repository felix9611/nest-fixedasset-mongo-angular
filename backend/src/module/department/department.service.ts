import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Department } from './department.schame'
import { Model } from 'mongoose'

@Injectable()
export class DepartmentService {
    constructor(@InjectModel(Department.name) private departmentModel: Model<Department>) {}

    async findAll(): Promise<Department[]> {
        return this.departmentModel.find({
            status: 1
        }).exec();
    }
}