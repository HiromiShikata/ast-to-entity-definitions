// ./src/adapter/repositories/TsMorphEntityDefinitionRepository.ts
import { TsMorphEntityDefinitionRepository } from './TsMorphEntityDefinitionRepository';
import * as ts from 'ts-morph';
import { Node } from 'ts-morph';

describe('TsMorphEntityDefinitionRepository', () => {
  let repository: TsMorphEntityDefinitionRepository;

  beforeEach(() => {
    repository = new TsMorphEntityDefinitionRepository();
  });
  describe('find', () => {
    it('should return an array of EntityDefinition', async () => {
      const path = './testdata/src/domain/entities';
      const result = await repository.find(path);

      expect(result).toEqual([
        {
          name: 'Administrator',
          properties: [
            {
              acceptableValues: null,
              isNullable: false,
              isReference: false,
              name: 'id',
              propertyType: 'string',
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
              isNullable: false,
              isReference: false,
              name: 'role',
              propertyType: 'string',
            },
            {
              acceptableValues: null,
              isNullable: false,
              isReference: false,
              name: 'deactivated',
              propertyType: 'boolean',
            },
            {
              acceptableValues: null,
              isNullable: false,
              isReference: false,
              name: 'createdAt',
              propertyType: 'Date',
            },
          ],
        },
        {
          name: 'Group',
          properties: [
            {
              acceptableValues: null,
              isNullable: false,
              isReference: false,
              name: 'id',
              propertyType: 'string',
            },
            {
              acceptableValues: null,
              isNullable: false,
              isReference: false,
              name: 'name',
              propertyType: 'string',
            },
            {
              acceptableValues: ['Sports', 'Music', 'Movies'],
              isNullable: false,
              isReference: false,
              name: 'category',
              propertyType: 'string',
            },
          ],
        },
        {
          name: 'Item',
          properties: [
            {
              acceptableValues: null,
              isNullable: false,
              isReference: false,
              name: 'id',
              propertyType: 'string',
            },
            {
              acceptableValues: null,
              isNullable: false,
              isReference: false,
              name: 'name',
              propertyType: 'string',
            },
          ],
        },
        {
          name: 'User',
          properties: [
            {
              acceptableValues: null,
              isNullable: false,
              isReference: false,
              name: 'id',
              propertyType: 'string',
            },
            {
              acceptableValues: null,
              isNullable: false,
              isReference: false,
              name: 'name',
              propertyType: 'string',
            },
            {
              acceptableValues: null,
              isNullable: false,
              isReference: false,
              name: 'deactivated',
              propertyType: 'boolean',
            },
            {
              acceptableValues: null,
              isNullable: false,
              isReference: false,
              name: 'createdAt',
              propertyType: 'Date',
            },
          ],
        },
        {
          name: 'UserAddress',
          properties: [
            {
              acceptableValues: null,
              isNullable: false,
              isReference: false,
              name: 'id',
              propertyType: 'string',
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
              isNullable: false,
              isReference: false,
              name: 'address',
              propertyType: 'string',
            },
            {
              acceptableValues: ['home'],
              isNullable: false,
              isReference: false,
              name: 'stringLiteral',
              propertyType: 'string',
            },
            {
              acceptableValues: ['1'],
              isNullable: false,
              isReference: false,
              name: 'numberLiteral',
              propertyType: 'number',
            },
            {
              acceptableValues: null,
              isNullable: false,
              isReference: false,
              name: 'booleanLiteral',
              propertyType: 'boolean',
            },
            {
              acceptableValues: null,
              isNullable: true,
              isReference: false,
              name: 'nullableWithNullUnion',
              propertyType: 'string',
            },
            {
              acceptableValues: null,
              isNullable: true,
              isReference: false,
              name: 'nullableWithUndefined',
              propertyType: 'string',
            },
            {
              acceptableValues: null,
              isNullable: true,
              isReference: false,
              name: 'nullableWithQuestionMark',
              propertyType: 'string',
            },
            {
              acceptableValues: ['dog', 'cat'],
              isNullable: true,
              isReference: false,
              name: 'unionLiteralsWithSameTypeNullable',
              propertyType: 'string',
            },
            {
              acceptableValues: ['dog', 'cat'],
              isNullable: true,
              isReference: false,
              name: 'unionLiteralsWithSameTypeQuestionMark',
              propertyType: 'string',
            },
            {
              acceptableValues: ['dog', 'cat'],
              isNullable: false,
              isReference: false,
              name: 'unionLiteralsWithSameType',
              propertyType: 'string',
            },
          ],
        },
        {
          name: 'UserGroup',
          properties: [
            {
              acceptableValues: null,
              isNullable: false,
              isReference: false,
              name: 'id',
              propertyType: 'string',
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
