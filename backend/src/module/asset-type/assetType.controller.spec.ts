import { Test, TestingModule } from '@nestjs/testing';
import { AssetTypeController } from './assetType.controller';
import { AssetTypeService } from './assetType.service';
import { AuthGuard } from '../auth/AuthGuard';

describe('AssetTypeController', () => {
  let controller: AssetTypeController;
  let service: AssetTypeService;

  const mockAssetTypeService = {
    create: jest.fn(),
    update: jest.fn(),
    getOneById: jest.fn(),
    findAll: jest.fn(),
    listAssetTypeBySearch: jest.fn(),
    voidOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetTypeController],
      providers: [
        {
          provide: AssetTypeService,
          useValue: mockAssetTypeService,
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AssetTypeController>(AssetTypeController);
    service = module.get<AssetTypeService>(AssetTypeService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call service.create and return the result', async () => {
      const dto = { typeCode: '001', typeName: 'Test Type' };
      const result = { msg: 'Created successfully' };
      mockAssetTypeService.create.mockResolvedValue(result);

      expect(await controller.create(dto)).toEqual(result);
      expect(mockAssetTypeService.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should call service.update and return the result', async () => {
      const dto = { _id: '123', typeCode: '001', typeName: 'Updated Type' };
      const result = { msg: 'Updated successfully' };
      mockAssetTypeService.update.mockResolvedValue(result);

      expect(await controller.update(dto)).toEqual(result);
      expect(mockAssetTypeService.update).toHaveBeenCalledWith(dto);
    });
  });

  describe('getOneById', () => {
    it('should call service.getOneById and return the result', async () => {
      const id = '123';
      const result = { _id: '123', typeCode: '001', typeName: 'Test Type' };
  
      // Mock the service method to return the expected result
      mockAssetTypeService.getOneById.mockResolvedValue(result);
  
      // Call the controller method and assert the result
      expect(await controller.getOneById(id)).toEqual(result);
      expect(mockAssetTypeService.getOneById).toHaveBeenCalledWith(id);
    });
  });

  describe('getAll', () => {
    it('should call service.findAll and return the result', async () => {
      const result = [{ _id: '123', typeCode: '001', typeName: 'Test Type' }];
      mockAssetTypeService.findAll.mockResolvedValue(result);

      expect(await controller.getAll()).toEqual(result);
      expect(mockAssetTypeService.findAll).toHaveBeenCalled();
    });
  });


  describe('remove', () => {
    it('should call service.voidOne and return the result', async () => {
      const id = '123';
      const result = { msg: 'Removed successfully' };
      mockAssetTypeService.voidOne.mockResolvedValue(result);

      expect(await controller.remove(id)).toEqual(result);
      expect(mockAssetTypeService.voidOne).toHaveBeenCalledWith(id);
    });
  });

  describe('listAndPage', () => {
    it('should call service.listAssetTypeBySearch and return the result', async () => {
      const dto = { page: 1, limit: 10 };
      const result = { data: [], total: 0 };
      mockAssetTypeService.listAssetTypeBySearch.mockResolvedValue(result);

      expect(await controller.listAndPage(dto)).toEqual(result);
      expect(mockAssetTypeService.listAssetTypeBySearch).toHaveBeenCalledWith(dto);
    });
  })
});