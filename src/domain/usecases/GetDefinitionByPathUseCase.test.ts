import { GetDefinitionByPathUseCase } from './GetDefinitionByPathUseCase';
import { EntityDefinitionRepository } from './adapter-interfaces/EntityDefinitionRepository';
import { Definition } from '../entities/Definition';
import { EntityDefinition } from '../entities/EntityDefinition';

describe('GetDefinitionByPathUseCase', () => {
  describe('run', () => {
    it('returns definitions with no relations for empty directory', async () => {
      const directoryPath = '/example/directory/path';
      const expectedDefinitions: Definition = {
        entityDefinitions: [],
        relationDefinitions: [],
      };
      const { useCase, entityDefinitionRepository } =
        createUseCaseAndMockRepositories();
      const result = await useCase.run(directoryPath);

      expect(result).toEqual(expectedDefinitions);
      expect(entityDefinitionRepository.find).toHaveBeenCalledWith(
        directoryPath,
      );
    });

    it('returns definitions with relations for directory with related entity definitions', async () => {
      const directoryPath = '/example/directory/path';
      const expectedDefinitions: Definition = {
        entityDefinitions: [
          {
            typeName: 'User',
            properties: [
              { name: 'id', propertyType: 'string', isReference: false },
              { name: 'name', propertyType: 'string', isReference: false },
              { name: 'email', propertyType: 'string', isReference: false },
            ],
          },
          {
            typeName: 'Group',
            properties: [
              { name: 'id', propertyType: 'string', isReference: false },
              { name: 'name', propertyType: 'string', isReference: false },
            ],
          },
          {
            typeName: 'UserGroup',
            properties: [
              { name: 'id', propertyType: 'string', isReference: false },
              {
                name: 'userId',
                propertyType: 'User',
                isReference: true,
                isUnique: false,
              },
              {
                name: 'groupId',
                propertyType: 'Group',
                isReference: true,
                isUnique: false,
              },
            ],
          },
          {
            typeName: 'UserAddress',
            properties: [
              { name: 'id', propertyType: 'string', isReference: false },
              {
                name: 'userId',
                propertyType: 'User',
                isReference: true,
                isUnique: true,
              },
              { name: 'address', propertyType: 'string', isReference: false },
            ],
          },
        ],
        relationDefinitions: [
          {
            name: 'userId',
            sourceEntityDefinitionName: 'UserGroup',
            targetEntityDefinitionName: 'User',
            isOneToOneRelationShop: false,
          },
          {
            name: 'groupId',
            sourceEntityDefinitionName: 'UserGroup',
            targetEntityDefinitionName: 'Group',
            isOneToOneRelationShop: false,
          },
          {
            name: 'userId',
            sourceEntityDefinitionName: 'UserAddress',
            targetEntityDefinitionName: 'User',
            isOneToOneRelationShop: true,
          },
        ],
      };
      const entityDefinitions: EntityDefinition[] = [
        {
          typeName: 'User',
          properties: [
            { name: 'id', propertyType: 'string', isReference: false },
            { name: 'name', propertyType: 'string', isReference: false },
            { name: 'email', propertyType: 'string', isReference: false },
          ],
        },
        {
          typeName: 'Group',
          properties: [
            { name: 'id', propertyType: 'string', isReference: false },
            { name: 'name', propertyType: 'string', isReference: false },
          ],
        },

        {
          typeName: 'UserGroup',
          properties: [
            { name: 'id', propertyType: 'string', isReference: false },
            {
              name: 'userId',
              propertyType: 'User',
              isReference: true,
              isUnique: false,
            },
            {
              name: 'groupId',
              propertyType: 'Group',
              isReference: true,
              isUnique: false,
            },
          ],
        },
        {
          typeName: 'UserAddress',
          properties: [
            { name: 'id', propertyType: 'string', isReference: false },
            {
              name: 'userId',
              propertyType: `User`,
              isReference: true,
              isUnique: true,
            },
            { name: 'address', propertyType: 'string', isReference: false },
          ],
        },
      ];
      const { useCase, entityDefinitionRepository } =
        createUseCaseAndMockRepositories();
      entityDefinitionRepository.find.mockResolvedValueOnce(entityDefinitions);
      const result = await useCase.run(directoryPath);

      expect(result).toEqual(expectedDefinitions);
      expect(entityDefinitionRepository.find).toHaveBeenCalledWith(
        directoryPath,
      );
    });
  });
  const createUseCaseAndMockRepositories = () => {
    const entityDefinitionRepository = createMockEntityDefinitionRepository();
    const useCase = new GetDefinitionByPathUseCase(entityDefinitionRepository);
    return {
      entityDefinitionRepository,
      useCase,
    };
  };
  const createMockEntityDefinitionRepository = () => {
    const repository: EntityDefinitionRepository = {
      find: async (_path: string): Promise<EntityDefinition[]> => {
        return [];
      },
    };
    return {
      find: jest.fn((path: string) => repository.find(path)),
    };
  };
});
