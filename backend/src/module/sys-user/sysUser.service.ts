
import { Injectable } from '@nestjs/common'
import { SysUser } from './sysUser.schame'
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { CreateUserDto, CreateUserRequestDto, ListUserRequestDto } from './sysUser.dto'
import { createUserKey } from './constants'
import { hashPassword, salt } from 'src/tool/password-tools'

export type User = any

@Injectable()
export class SysUserService {
  constructor(@InjectModel(SysUser.name) private sysUserModel: Model<SysUser>) {}

  async createUser(createUserRequest: CreateUserRequestDto) {
    const { key, userData } = createUserRequest

    if (key === createUserKey) {
      const checkData = await this.sysUserModel.findOne({ username: userData.username, email: userData.email })

      if (checkData) {
        return {
          msg: 'The user already exist! Please check again!'
        }
      } else {
        const newPasswordString = hashPassword(userData.password, salt)

        const finalData = {
          username: userData.username,
          password: newPasswordString,
          avatarBase64: userData.avatarBase64,
          email: userData.email,
          deptId: userData.deptId,
          roles: userData.roles,
          createdAt: new Date(),
          status: 1
        }

        return await this.sysUserModel.create(finalData)
      }

    } else {
      return {
        msg: 'Key not match! Please contact admin!'
      }
    }

  }

  async updateUser(_id: string, userData: CreateUserDto) {
    const checkData = await this.sysUserModel.findOne({ _id})

    if (checkData?.status === 0) {
      return {
        msg: 'This user has been invalidated! Please contact admin!'
      }
    } else {
      return await this.sysUserModel.updateOne({ _id}, {
        ...userData,
        updateAt: new Date()
      })
    }
  }

  async invalidateUser(_id: string) {
    const checkData = await this.sysUserModel.findOne({ _id})

    if (checkData?.status === 0) {
      return {
        msg: 'This user has been invalidated! Please contact admin!'
      }
    } else {
      const res = await this.sysUserModel.updateOne({ _id}, {
        status: 0,
        updateAt: new Date()
      })

      if (res.modifiedCount === 1) {
        return {
          msg: 'Update successfully!'
        }
      } else {
        return {
          msg: 'Ooops! Something went wrong! Please try again!'
        }
      }
    }
  }

  async updatePassword(username: string, password: string) {
    const checkData = await this.sysUserModel.findOne({ username })

    if (checkData) {
      const newPasswordSting = hashPassword(password, salt)

      const res = await this.sysUserModel.updateOne({ username }, { password: newPasswordSting})

      if (res.modifiedCount === 1) {
        return {
          msg: 'Renew password successfully!'
        }
      } else {
        return {
          msg: 'Ooops! Something went wrong! Please try again!'
        }
      }
    } else {
      return {
        msg: 'This user has been invalidated or does not exist! Please contact admin!'
      }
    }
  }

  async getUserInfo(_id: string) {
    const answer = await this.sysUserModel.findOne({ _id})
    return {
      _id: answer?._id,
      username: answer?.username,
      email: answer?.email,
      avatarBase64: answer?.avatarBase64,
      lastLogin: answer?.lastLogin,
      roles: answer?.roles,
      deptId: answer?.deptId
    }

  }

  async findOneUser(username: string) {
    const answer = await this.sysUserModel.findOne({ username })
    return {
      _id: answer?._id,
      username: answer?.username,
      email: answer?.email,
      avatarBase64: answer?.avatarBase64,
      lastLogin: answer?.lastLogin,
      roles: answer?.roles,
      deptId: answer?.deptId
    }
  }

  async findOneUserAllData(username: string) {
    return await this.sysUserModel.findOne({ username })
  }

  async listUser(request: ListUserRequestDto) {
    const { page, limit, username, roleIds, deptIds } = request

    const skip = (page - 1) * limit

    const filters = {
      ...username ? { name: { $regex: username, $options: 'i' } } : {},
      ...roleIds ? { roleIds: { $in: roleIds} } : {},
      ...deptIds ? { deptId: { $in: deptIds} } : {},
    }

    const users = await this.sysUserModel.find(filters).skip(skip)
    .limit(limit)
    .exec()

    const total = await this.sysUserModel.countDocuments()

    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      data: users,
    }
  }

}
