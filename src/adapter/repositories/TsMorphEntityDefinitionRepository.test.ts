// ./src/adapter/repositories/TsMorphEntityDefinitionRepository.ts
import { TsMorphEntityDefinitionRepository } from './TsMorphEntityDefinitionRepository';
import * as ts from 'ts-morph';
import type { Node } from 'ts-morph';
import { EntityDefinition } from '../../domain/entities/EntityDefinition';

describe('TsMorphEntityDefinitionRepository', () => {
  let repository: TsMorphEntityDefinitionRepository;

  beforeEach(() => {
    repository = new TsMorphEntityDefinitionRepository();
  });
  describe('find', () => {
    it('should return an array of EntityDefinition', async () => {
      const path = './testdata/src/domain/entities';
      const result = await repository.find(path);

      expect(result).toEqual<EntityDefinition[]>([
        {
          name: 'Administrator',
          properties: [
            {
              isReference: false,
              name: 'id',
              propertyType: 'Id',
            },
            {
              isNullable: false,
              isReference: true,
              isUnique: false,
              name: 'userId',
              targetEntityDefinitionName: 'User',
            },
            {
              acceptableValues: ['administrator'],
              isUnique: false,
              isNullable: false,
              isReference: false,
              isArray: false,
              name: 'role',
              propertyType: 'string',
            },
            {
              acceptableValues: null,
              isUnique: false,
              isNullable: false,
              isReference: false,
              isArray: false,
              name: 'deactivated',
              propertyType: 'boolean',
            },
            {
              acceptableValues: null,
              isUnique: false,
              isNullable: false,
              isReference: false,
              isArray: false,
              name: 'createdAt',
              propertyType: 'Date',
            },
          ],
        },
        {
          name: 'Group',
          properties: [
            {
              isReference: false,
              name: 'id',
              propertyType: 'Id',
            },
            {
              acceptableValues: null,
              isUnique: false,
              isNullable: false,
              isReference: false,
              isArray: false,
              name: 'name',
              propertyType: 'string',
            },
            {
              acceptableValues: ['Sports', 'Music', 'Movies'],
              isUnique: false,
              isNullable: false,
              isReference: false,
              isArray: false,
              name: 'category',
              propertyType: 'string',
            },
          ],
        },
        {
          name: 'Item',
          properties: [
            {
              isReference: false,
              name: 'id',
              propertyType: 'Id',
            },
            {
              acceptableValues: null,
              isUnique: false,
              isNullable: false,
              isReference: false,
              isArray: false,
              name: 'name',
              propertyType: 'string',
            },
          ],
        },
        {
          name: 'User',
          properties: [
            {
              isReference: false,
              name: 'id',
              propertyType: 'Id',
            },
            {
              acceptableValues: null,
              isUnique: false,
              isNullable: false,
              isReference: false,
              isArray: false,
              name: 'name',
              propertyType: 'string',
            },
            {
              acceptableValues: null,
              isUnique: false,
              isNullable: false,
              isReference: false,
              isArray: false,
              name: 'deactivated',
              propertyType: 'boolean',
            },
            {
              acceptableValues: null,
              isUnique: false,
              isNullable: false,
              isReference: false,
              isArray: false,
              name: 'createdAt',
              propertyType: 'Date',
            },
            {
              isNullable: true,
              isReference: true,
              isUnique: false,
              name: 'parentUserId',
              targetEntityDefinitionName: 'User',
            },
          ],
        },
        {
          name: 'UserAddress',
          properties: [
            {
              isReference: false,
              name: 'id',
              propertyType: 'Id',
            },
            {
              isNullable: false,
              isReference: true,
              isUnique: true,
              name: 'userId',
              targetEntityDefinitionName: 'User',
            },
            {
              acceptableValues: null,
              isUnique: true,
              isNullable: false,
              isReference: false,
              isArray: false,
              name: 'address',
              propertyType: 'string',
            },
            {
              acceptableValues: null,
              isUnique: false,
              isArray: true,
              isNullable: false,
              isReference: false,
              name: 'stringArray',
              propertyType: 'string',
            },
            {
              acceptableValues: null,
              isUnique: false,
              isArray: true,
              isNullable: false,
              isReference: false,
              name: 'numberArray',
              propertyType: 'number',
            },
            {
              acceptableValues: null,
              isUnique: false,
              isArray: true,
              isNullable: false,
              isReference: false,
              name: 'booleanArray',
              propertyType: 'boolean',
            },
            {
              acceptableValues: null,
              isUnique: false,
              isArray: true,
              isNullable: false,
              isReference: false,
              name: 'dateArray',
              propertyType: 'Date',
            },
            {
              acceptableValues: ['home'],
              isUnique: false,
              isNullable: false,
              isReference: false,
              isArray: false,
              name: 'stringLiteral',
              propertyType: 'string',
            },
            {
              acceptableValues: ['1'],
              isUnique: false,
              isNullable: false,
              isReference: false,
              isArray: false,
              name: 'numberLiteral',
              propertyType: 'number',
            },
            {
              acceptableValues: null,
              isUnique: false,
              isNullable: false,
              isReference: false,
              isArray: false,
              name: 'booleanLiteral',
              propertyType: 'boolean',
            },
            {
              acceptableValues: null,
              isUnique: false,
              isNullable: true,
              isReference: false,
              isArray: false,
              name: 'nullableWithNullUnion',
              propertyType: 'string',
            },
            {
              acceptableValues: null,
              isUnique: false,
              isNullable: true,
              isReference: false,
              isArray: false,
              name: 'nullableWithUndefined',
              propertyType: 'string',
            },
            {
              acceptableValues: null,
              isUnique: false,
              isNullable: true,
              isReference: false,
              isArray: false,
              name: 'nullableWithQuestionMark',
              propertyType: 'string',
            },
            {
              acceptableValues: ['dog', 'cat'],
              isUnique: false,
              isNullable: true,
              isReference: false,
              isArray: false,
              name: 'unionLiteralsWithSameTypeNullable',
              propertyType: 'string',
            },
            {
              acceptableValues: ['dog', 'cat'],
              isUnique: false,
              isNullable: true,
              isReference: false,
              isArray: false,
              name: 'unionLiteralsWithSameTypeQuestionMark',
              propertyType: 'string',
            },
            {
              acceptableValues: ['dog', 'cat'],
              isUnique: false,
              isNullable: false,
              isReference: false,
              isArray: false,
              name: 'unionLiteralsWithSameType',
              propertyType: 'string',
            },
          ],
        },
        {
          name: 'UserGroup',
          properties: [
            {
              isReference: false,
              name: 'id',
              propertyType: 'Id',
            },
            {
              isNullable: false,
              isReference: true,
              isUnique: false,
              name: 'userId',
              targetEntityDefinitionName: 'User',
            },
            {
              isNullable: false,
              isReference: true,
              isUnique: false,
              name: 'groupId',
              targetEntityDefinitionName: 'Group',
            },
          ],
        },
      ]);
    });
  });
  describe('isNullable', () => {
    it('success', async () => {
      const project = new ts.Project();
      project.addSourceFileAtPath(
        './testdata/src/domain/entities/UserAddress.ts',
      );
      const userAddressType = project
        .getSourceFiles()
        .flatMap((s) => s.getTypeAliases())[0]
        .getType();
      userAddressType.getPropertyOrThrow('id');

      const getPropertyType = (name: string): Node => {
        const property = userAddressType.getPropertyOrThrow(name);
        const valueDeclaration = property.getValueDeclaration();
        if (!valueDeclaration) {
          throw new Error(`valueDeclaration is undefined.`);
        }
        return valueDeclaration;
      };

      expect(repository.isNullable(getPropertyType('id'))).toEqual(false);
      expect(
        repository.isNullable(getPropertyType('nullableWithNullUnion')),
      ).toEqual(true);
      expect(
        repository.isNullable(getPropertyType('nullableWithUndefined')),
      ).toEqual(true);
      expect(
        repository.isNullable(getPropertyType('nullableWithQuestionMark')),
      ).toEqual(true);
      expect(
        repository.isNullable(
          getPropertyType('unionLiteralsWithSameTypeNullable'),
        ),
      ).toEqual(true);

      expect(
        repository.isNullable(
          getPropertyType('unionLiteralsWithSameTypeQuestionMark'),
        ),
      ).toEqual(true);

      expect(
        repository.isNullable(getPropertyType('unionLiteralsWithSameType')),
      ).toEqual(false);
    });
  });
});
