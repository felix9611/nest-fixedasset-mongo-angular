import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { SysMenu } from './sys-menu.schame'
import { InjectModel } from '@nestjs/mongoose'
import { SysMenuDto, SysMenuList, UpdateSysMenuDto } from './sys-menu.dto'
import { ActionRecordService } from '../action-record/actionRecord.service'


@Injectable()
export class SysMenuService {
  constructor(
      @InjectModel(SysMenu.name) private sysMenuModel: Model<SysMenu>,
      private actionRecordService: ActionRecordService
  ) {}

  async create(createData: UpdateSysMenuDto) {
    let { mainId, name, _id, ..._data } = createData

    const checkData = await this.sysMenuModel.findOne({ name,  })

    if (checkData) {
      await this.actionRecordService.saveRecord({
          actionName: 'Create System Menu',
          actionMethod: 'POST',
          actionFrom: 'System Menu',
          actionData: createData,
          actionSuccess: 'FAILURE',
          createdAt: new Date()
      })

      return {
          msg: 'This System Menu already exist!'
      }
    } else {


      const finalData = {
        ..._data,
        name,
        mainId,
        status: 1,
        createdAt: new Date()
      }

      await this.actionRecordService.saveRecord({
        actionName: 'Create System Menu',
        actionMethod: 'POST',
        actionFrom: 'System Menu',
        actionData: createData,
        actionSuccess: 'Success',
        createdAt: new Date()
      })

      const create = new this.sysMenuModel(finalData)
      return await create.save()
    }
  }

  async update(updateData: UpdateSysMenuDto) {
    const { _id, ...data } = updateData

    const checkData = await this.sysMenuModel.findOne({ _id })

    if (checkData?.status === 0) {
      await this.actionRecordService.saveRecord({
          actionName: 'Update System Menu',
          actionMethod: 'POST',
          actionFrom: 'System Menu',
          actionData: updateData,
          actionSuccess: 'FAILURE',
          createdAt: new Date()
      })

      return {
          msg: 'This System Menu has been invalidated! Please contact admin!'
      }
    } else {
      const finalData = {
        ...data,
          updatedAt: new Date()
      }

      await this.actionRecordService.saveRecord({
          actionName: 'Update System Menu',
          actionMethod: 'POST',
          actionFrom: 'System Menu',
          actionData: finalData,
          actionSuccess: 'Sussess',
          createdAt: new Date()
      })

      return await this.sysMenuModel.updateOne({ _id}, finalData)
    }
  }

  async getOneById(_id: string) {
    const data = await this.sysMenuModel.findOne({ _id, status: 1})

    if (data) {
      return data
    } else {
      return {
        msg: 'This System Menu has been invalidated! Please contact admin!'
      }
    }
  }

  async invalidate(_id: string) {
    const checkData = await this.sysMenuModel.findOne({ _id })

    if (checkData?.status === 0) {

        await this.actionRecordService.saveRecord({
            actionName: 'Void System Menu',
            actionMethod: 'GET',
            actionFrom: 'System Menu',
            actionData: {
                _id
            },
            actionSuccess: 'FAILURE',
            createdAt: new Date()
        })

        return {
            msg: 'This System Menu has been invalidated! Please contact admin!'
        }
    } else {
        const res = await this.sysMenuModel.updateOne({ _id}, {
            status: 0,
            updateAt: new Date()
        })
    
        if (res.modifiedCount === 1) {
            await this.actionRecordService.saveRecord({
                actionName: 'Void System Menu',
                actionMethod: 'GET',
                actionFrom: 'System Menu',
                actionData: {
                    _id,
                    status: 0,
                    updateAt: new Date()
                },
                actionSuccess: 'Success',
                createdAt: new Date()
            })


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

  async listAllMainIdMenu() {
    return await this.sysMenuModel.aggregate([
      {
        $match: { mainId: 0, type: 0 } // WHERE mainId = 0 AND type = 0
      },
      {
        $group: {
          _id: { mainId: '$mainId', name: '$name' }, // GROUP BY mainId, name
          _idValue: { $first: '$_id' } // Keep a unique _id
        }
      },
      {
        $project: {
          _id: '$_idValue',
          mainId: '$_id.mainId',
          name: '$_id.name'
        }
      }
    ])


  }

  async listAllMenu(query: SysMenuList) {
    return await this.sysMenuModel.find(
      {
        name: { $regex: query.name, $options: 'i'}
      }
    ).exec()
  }

  async getTreeAllMenuById(ids: string[]) {
    const items = await this.sysMenuModel.find({ status: 1, _id: { $in: ids} }).exec()

    const final = this.nestItems(items)

    return final
  }

  async getTreeAllMenu() {
    const items = await this.sysMenuModel.find({ status: 1 }).exec()

    const final = this.nestItems(items)

    return final
  }

  nestItems(items: any[]) {
    const map = new Map<number, any>() // items by ID
    const roots: any[] = [] // Top-level
  
    // First, populate the map
    items.forEach(item => map.set(item.id, { ...item, children: [] }))
  
    // Then, build the hierarchy
    items.forEach(item => {
      if (item.mainId === 0) {
        roots.push(map.get(item._id)!)
      } else {
        const parent = map.get(item.mainId)
        if (parent) {
          parent.children!.push(map.get(item._id)!)
        }
      }
    })
  
    this.sortItems(roots)
    return roots
  }

  sortItems(items: any[]) {
    items.sort((a, b) => a.sort - b.sort)
    items.forEach(item => {
      if (item.childrens!.length > 0) {
        this.sortItems(item.childrens!)
      } else {
        delete item.childrens // Remove empty children arrays
      }
    })
  }
}
/*

type Item = {
  _id: number;
  mainId: number;
  name: string;
  sort: number;
  children?: Item[];
};

function nestItems(items: Item[]): Item[] {
  const map = new Map<number, Item>(); // Store items by ID
  const roots: Item[] = []; // Store top-level items

  // First, populate the map
  items.forEach(item => map.set(item.id, { ...item, children: [] }));

  // Then, build the hierarchy
  items.forEach(item => {
    if (item.mainId === 0) {
      roots.push(map.get(item._id)!);
    } else {
      const parent = map.get(item.mainId);
      if (parent) {
        parent.children!.push(map.get(item._id)!);
      }
    }
  });

  // Sort recursively
  function sortItems(items: Item[]) {
    items.sort((a, b) => a.sort - b.sort);
    items.forEach(item => {
      if (item.children!.length > 0) {
        sortItems(item.children!);
      } else {
        delete item.children; // Remove empty children arrays
      }
    });
  }

  sortItems(roots);
  return roots;
}

// Test data
const data: Item[] = [
  { id: 1, mainId: 0, name: "Tongs", sort: 1 },
  { id: 2, mainId: 1, name: "Dogs", sort: 2 },
  { id: 3, mainId: 1, name: "Cats", sort: 1 },
  { id: 4, mainId: 0, name: "home", sort: 2 },
];

console.log(JSON.stringify(nestItems(data), null, 2));


*/