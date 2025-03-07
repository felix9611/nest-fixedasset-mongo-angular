import { Injectable } from '@nestjs/common'
import { SysRole } from './role.schame'
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class SysRoleService {
    constructor(@InjectModel(SysRole.name) private sysRoleModel: Model<SysRole>) {}

    async findAll(): Promise<SysRole[]> {
        return this.sysRoleModel.find({
            status: 1
        }).exec();
    }
}