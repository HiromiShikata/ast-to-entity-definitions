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
          properties: [
            {
              isNullable: false,
              isReference: false,
              name: 'id',
              propertyType: 'string',
            },
            {
              isNullable: false,
              isReference: false,
              name: 'name',
              propertyType: 'string',
            },
          ],
          typeName: 'Group',
        },
        {
          properties: [
            {
              isNullable: false,
              isReference: false,
              name: 'id',
              propertyType: 'string',
            },
            {
              isNullable: false,
              isReference: false,
              name: 'name',
              propertyType: 'string',
            },
            {
              isNullable: false,
              isReference: false,
              name: 'deactivated',
              propertyType: 'boolean',
            },
          ],
          typeName: 'User',
        },
        {
          properties: [
            {
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
              propertyType: 'User',
            },
            {
              isNullable: false,
              isReference: false,
              name: 'address',
              propertyType: 'string',
            },
            {
              isNullable: false,
              isReference: false,
              name: 'stringLiteral',
              propertyType: 'string',
            },
            {
              isNullable: false,
              isReference: false,
              name: 'numberLiteral',
              propertyType: 'number',
            },
            {
              isNullable: false,
              isReference: false,
              name: 'booleanLiteral',
              propertyType: 'boolean',
            },
            {
              isNullable: true,
              isReference: false,
              name: 'nullableWithNullUnion',
              propertyType: 'string',
            },
            {
              isNullable: true,
              isReference: false,
              name: 'nullableWithUndefined',
              propertyType: 'string',
            },
            {
              isNullable: true,
              isReference: false,
              name: 'nullableWithQuestionMark',
              propertyType: 'string',
            },
            {
              isNullable: true,
              isReference: false,
              name: 'unionLiteralsWithSameTypeNullable',
              propertyType: 'string',
            },
            {
              isNullable: true,
              isReference: false,
              name: 'unionLiteralsWithSameTypeQuestionMark',
              propertyType: 'string',
            },
            {
              isNullable: false,
              isReference: false,
              name: 'unionLiteralsWithSameType',
              propertyType: 'string',
            },
          ],
          typeName: 'UserAddress',
        },
        {
          properties: [
            {
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
              propertyType: 'User',
            },
            {
              isNullable: false,
              isReference: true,
              isUnique: false,
              name: 'groupId',
              propertyType: 'Group',
            },
          ],
          typeName: 'UserGroup',
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
