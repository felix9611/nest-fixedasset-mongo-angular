import { Injectable } from '@nestjs/common'
import { SysRole } from './role.schame'
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose'
import { CreateSysRoleDto } from './role.dto';

@Injectable()
export class SysRoleService {
    constructor(@InjectModel(SysRole.name) private sysRoleModel: Model<SysRole>) {}

    async findAll(): Promise<SysRole[]> {
        return this.sysRoleModel.find({
            status: 1
        }).exec();
    }

    async create(createData: CreateSysRoleDto) {
        const { code, name, ..._data } = createData

        const checkData = await this.checkRoleExist(name, code)

        if (checkData) {
            return {
                msg: 'This role already exist!'
            }
        } else {
            const finalData = {
                name,
                code, 
                ..._data,
                status: 1,
                createdAt: new Date()
            }

            const created = new this.sysRoleModel(finalData)
            return await created.save()
        }
    }

    async checkRoleExist(name: string, code: string) {
        return await this.sysRoleModel.findOne({ name, code, status: 1})
    }
}