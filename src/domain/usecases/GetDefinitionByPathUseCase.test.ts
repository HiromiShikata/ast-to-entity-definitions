import { GetDefinitionByPathUseCase } from './GetDefinitionByPathUseCase';
import { EntityDefinitionRepository } from './adapter-interfaces/EntityDefinitionRepository';
import { EntityDefinition } from '../entities/EntityDefinition';

describe('GetDefinitionByPathUseCase', () => {
  describe('run', () => {
    it('returns definitions with no relations for empty directory', async () => {
      const directoryPath = '/example/directory/path';
      const expectedEntityDefinitions: EntityDefinition[] = [];
      const { useCase, entityDefinitionRepository, fileSystemOperator } =
        createUseCaseAndMockRepositories();

      fileSystemOperator.list.mockReturnValue([]);

      const result = await useCase.run(directoryPath);

      expect(result).toEqual(expectedEntityDefinitions);
      expect(fileSystemOperator.list).toHaveBeenCalledWith(directoryPath);
      expect(entityDefinitionRepository.find).toHaveBeenCalledWith([]);
    });

    it('returns definitions with relations for directory with related entity definitions', async () => {
      const directoryPath = '/example/directory/path';
      const expectedEntityDefinitions: EntityDefinition[] = [
        {
          name: 'User',
          properties: [
            {
              name: 'id',
              propertyType: 'string',
              isReference: false,
              isUnique: false,
              isNullable: false,
              isArray: false,
              acceptableValues: null,
            },
            {
              name: 'name',
              propertyType: 'string',
              isUnique: false,
              isReference: false,
              isNullable: false,
              isArray: false,
              acceptableValues: null,
            },
            {
              name: 'email',
              propertyType: 'string',
              isUnique: false,
              isReference: false,
              isNullable: false,
              isArray: false,
              acceptableValues: null,
            },
          ],
        },
        {
          name: 'Group',
          properties: [
            {
              name: 'id',
              propertyType: 'string',
              isReference: false,
              isUnique: false,
              isNullable: false,
              isArray: false,
              acceptableValues: null,
            },
            {
              name: 'name',
              propertyType: 'string',
              isReference: false,
              isUnique: false,
              isNullable: false,
              isArray: false,
              acceptableValues: null,
            },
            {
              name: 'category',
              propertyType: 'string',
              isReference: false,
              isUnique: false,
              isNullable: false,
              isArray: false,
              acceptableValues: ['Sports', 'Music', 'Movies'],
            },
          ],
        },
        {
          name: 'UserGroup',
          properties: [
            {
              name: 'id',
              propertyType: 'string',
              isReference: false,
              isUnique: false,
              isNullable: false,
              isArray: false,
              acceptableValues: null,
            },
            {
              name: 'userId',
              targetEntityDefinitionName: 'User',
              isReference: true,
              isUnique: false,
              isNullable: false,
            },
            {
              name: 'groupId',
              targetEntityDefinitionName: 'Group',
              isReference: true,
              isUnique: false,
              isNullable: false,
            },
          ],
        },
        {
          name: 'UserAddress',
          properties: [
            {
              name: 'id',
              propertyType: 'string',
              isReference: false,
              isUnique: false,
              isNullable: false,
              isArray: false,
              acceptableValues: null,
            },
            {
              name: 'userId',
              targetEntityDefinitionName: 'User',
              isReference: true,
              isUnique: true,
              isNullable: false,
            },
            {
              name: 'address',
              propertyType: 'string',
              isReference: false,
              isUnique: true,
              isNullable: false,
              isArray: false,
              acceptableValues: null,
            },
          ],
        },
      ];

      const entityDefinitions: EntityDefinition[] = [
        {
          name: 'User',
          properties: [
            {
              name: 'id',
              propertyType: 'string',
              isReference: false,
              isUnique: false,
              isNullable: false,
              isArray: false,
              acceptableValues: null,
            },
            {
              name: 'name',
              propertyType: 'string',
              isReference: false,
              isUnique: false,
              isNullable: false,
              isArray: false,
              acceptableValues: null,
            },
            {
              name: 'email',
              propertyType: 'string',
              isReference: false,
              isUnique: false,
              isNullable: false,
              isArray: false,
              acceptableValues: null,
            },
          ],
        },
        {
          name: 'Group',
          properties: [
            {
              name: 'id',
              propertyType: 'string',
              isReference: false,
              isUnique: false,
              isNullable: false,
              isArray: false,
              acceptableValues: null,
            },
            {
              name: 'name',
              propertyType: 'string',
              isReference: false,
              isUnique: false,
              isNullable: false,
              isArray: false,
              acceptableValues: null,
            },

            {
              name: 'category',
              propertyType: 'string',
              isReference: false,
              isUnique: false,
              isNullable: false,
              isArray: false,
              acceptableValues: ['Sports', 'Music', 'Movies'],
            },
          ],
        },
        {
          name: 'UserGroup',
          properties: [
            {
              name: 'id',
              propertyType: 'string',
              isReference: false,
              isUnique: false,
              isNullable: false,
              isArray: false,
              acceptableValues: null,
            },
            {
              name: 'userId',
              targetEntityDefinitionName: 'User',
              isReference: true,
              isUnique: false,
              isNullable: false,
            },
            {
              name: 'groupId',
              targetEntityDefinitionName: 'Group',
              isReference: true,
              isUnique: false,
              isNullable: false,
            },
          ],
        },
        {
          name: 'UserAddress',
          properties: [
            {
              name: 'id',
              propertyType: 'string',
              isReference: false,
              isUnique: false,
              isNullable: false,
              isArray: false,
              acceptableValues: null,
            },
            {
              name: 'userId',
              targetEntityDefinitionName: `User`,
              isReference: true,
              isUnique: true,
              isNullable: false,
            },
            {
              name: 'address',
              propertyType: 'string',
              isReference: false,
              isUnique: true,
              isNullable: false,
              isArray: false,
              acceptableValues: null,
            },
          ],
        },
      ];
      const { useCase, entityDefinitionRepository, fileSystemOperator } =
        createUseCaseAndMockRepositories();

      const mockFiles = [
        '/example/directory/path/User.ts',
        '/example/directory/path/Group.ts',
      ];
      fileSystemOperator.list.mockReturnValue(mockFiles);
      entityDefinitionRepository.find.mockResolvedValueOnce(entityDefinitions);

      const result = await useCase.run(directoryPath);

      expect(result).toEqual(expectedEntityDefinitions);
      expect(fileSystemOperator.list).toHaveBeenCalledWith(directoryPath);
      expect(entityDefinitionRepository.find).toHaveBeenCalledWith(mockFiles);
    });

    it('excludes specified type names when excludeTypeNames option is provided', async () => {
      const directoryPath = '/example/directory/path';
      const allEntityDefinitions: EntityDefinition[] = [
        {
          name: 'User',
          properties: [
            {
              name: 'id',
              propertyType: 'string',
              isReference: false,
              isUnique: false,
              isNullable: false,
              isArray: false,
              acceptableValues: null,
            },
          ],
        },
        {
          name: 'Group',
          properties: [
            {
              name: 'id',
              propertyType: 'string',
              isReference: false,
              isUnique: false,
              isNullable: false,
              isArray: false,
              acceptableValues: null,
            },
          ],
        },
        {
          name: 'UserGroup',
          properties: [
            {
              name: 'id',
              propertyType: 'string',
              isReference: false,
              isUnique: false,
              isNullable: false,
              isArray: false,
              acceptableValues: null,
            },
          ],
        },
      ];

      const expectedEntityDefinitions: EntityDefinition[] = [
        {
          name: 'User',
          properties: [
            {
              name: 'id',
              propertyType: 'string',
              isReference: false,
              isUnique: false,
              isNullable: false,
              isArray: false,
              acceptableValues: null,
            },
          ],
        },
      ];

      const { useCase, entityDefinitionRepository, fileSystemOperator } =
        createUseCaseAndMockRepositories();

      const mockFiles = [
        '/example/directory/path/User.ts',
        '/example/directory/path/Group.ts',
        '/example/directory/path/UserGroup.ts',
      ];
      fileSystemOperator.list.mockReturnValue(mockFiles);
      entityDefinitionRepository.find.mockResolvedValueOnce(
        allEntityDefinitions,
      );
      const result = await useCase.run(directoryPath, {
        excludeTypeNames: ['Group', 'UserGroup'],
      });

      expect(result).toEqual(expectedEntityDefinitions);
      expect(fileSystemOperator.list).toHaveBeenCalledWith(directoryPath);
      expect(entityDefinitionRepository.find).toHaveBeenCalledWith(mockFiles);
    });

    it('returns all definitions when excludeTypeNames is empty array', async () => {
      const directoryPath = '/example/directory/path';
      const allEntityDefinitions: EntityDefinition[] = [
        {
          name: 'User',
          properties: [
            {
              name: 'id',
              propertyType: 'string',
              isReference: false,
              isUnique: false,
              isNullable: false,
              isArray: false,
              acceptableValues: null,
            },
          ],
        },
        {
          name: 'Group',
          properties: [
            {
              name: 'id',
              propertyType: 'string',
              isReference: false,
              isUnique: false,
              isNullable: false,
              isArray: false,
              acceptableValues: null,
            },
          ],
        },
      ];

      const { useCase, entityDefinitionRepository, fileSystemOperator } =
        createUseCaseAndMockRepositories();

      const mockFiles = [
        '/example/directory/path/User.ts',
        '/example/directory/path/Group.ts',
      ];
      fileSystemOperator.list.mockReturnValue(mockFiles);
      entityDefinitionRepository.find.mockResolvedValueOnce(
        allEntityDefinitions,
      );
      const result = await useCase.run(directoryPath, {
        excludeTypeNames: [],
      });

      expect(result).toEqual(allEntityDefinitions);
      expect(fileSystemOperator.list).toHaveBeenCalledWith(directoryPath);
      expect(entityDefinitionRepository.find).toHaveBeenCalledWith(mockFiles);
    });

    it('excludes files matching excludeFileNames patterns', async () => {
      const directoryPath = '/example/directory/path';
      const allEntityDefinitions: EntityDefinition[] = [
        {
          name: 'User',
          properties: [
            {
              name: 'id',
              propertyType: 'string',
              isReference: false,
              isUnique: false,
              isNullable: false,
              isArray: false,
              acceptableValues: null,
            },
          ],
        },
        {
          name: 'Group',
          properties: [
            {
              name: 'id',
              propertyType: 'string',
              isReference: false,
              isUnique: false,
              isNullable: false,
              isArray: false,
              acceptableValues: null,
            },
          ],
        },
      ];

      const { useCase, entityDefinitionRepository, fileSystemOperator } =
        createUseCaseAndMockRepositories();

      const allFiles = [
        '/example/directory/path/User.ts',
        '/example/directory/path/Admin.ts',
        '/example/directory/path/TestHelper.ts',
        '/example/directory/path/Group.ts',
      ];
      fileSystemOperator.list.mockReturnValue(allFiles);
      entityDefinitionRepository.find.mockResolvedValueOnce(
        allEntityDefinitions,
      );

      const result = await useCase.run(directoryPath, {
        excludeFileNames: ['*Admin*.ts', 'Test*.ts'],
      });

      expect(result).toEqual(allEntityDefinitions);
      expect(fileSystemOperator.list).toHaveBeenCalledWith(directoryPath);
      // Admin.ts and TestHelper.ts should be excluded
      expect(entityDefinitionRepository.find).toHaveBeenCalledWith([
        '/example/directory/path/User.ts',
        '/example/directory/path/Group.ts',
      ]);
    });

    it('returns all files when excludeFileNames is empty', async () => {
      const directoryPath = '/example/directory/path';
      const allEntityDefinitions: EntityDefinition[] = [
        {
          name: 'User',
          properties: [
            {
              name: 'id',
              propertyType: 'string',
              isReference: false,
              isUnique: false,
              isNullable: false,
              isArray: false,
              acceptableValues: null,
            },
          ],
        },
      ];

      const { useCase, entityDefinitionRepository, fileSystemOperator } =
        createUseCaseAndMockRepositories();

      const allFiles = ['/example/directory/path/User.ts'];
      fileSystemOperator.list.mockReturnValue(allFiles);
      entityDefinitionRepository.find.mockResolvedValueOnce(
        allEntityDefinitions,
      );

      const result = await useCase.run(directoryPath, {
        excludeFileNames: [],
      });

      expect(result).toEqual(allEntityDefinitions);
      expect(fileSystemOperator.list).toHaveBeenCalledWith(directoryPath);
      expect(entityDefinitionRepository.find).toHaveBeenCalledWith(allFiles);
    });
  });
  const createUseCaseAndMockRepositories = () => {
    const entityDefinitionRepository = createMockEntityDefinitionRepository();
    const fileSystemOperator = createMockFileSystemOperator();
    const useCase = new GetDefinitionByPathUseCase(
      entityDefinitionRepository,
      fileSystemOperator,
    );
    return {
      entityDefinitionRepository,
      fileSystemOperator,
      useCase,
    };
  };
  const createMockEntityDefinitionRepository = () => {
    const repository: EntityDefinitionRepository = {
      find: async (_filePaths: string[]): Promise<EntityDefinition[]> => {
        return [];
      },
    };
    return {
      find: jest.fn((filePaths: string[]) => repository.find(filePaths)),
    };
  };
  const createMockFileSystemOperator = () => {
    return {
      list: jest.fn((_directoryPath: string): string[] => []),
    };
  };
});
