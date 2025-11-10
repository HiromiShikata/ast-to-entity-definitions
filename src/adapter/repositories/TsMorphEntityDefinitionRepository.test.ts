// ./src/adapter/repositories/TsMorphEntityDefinitionRepository.ts
import * as ts from 'ts-morph';
import {
  PropertyTypeDeclaration,
  TsMorphEntityDefinitionRepository,
} from './TsMorphEntityDefinitionRepository';
import { EntityDefinition } from '../../domain/entities/EntityDefinition';

import { readdirSync } from 'fs';
import { join } from 'path';

describe('TsMorphEntityDefinitionRepository', () => {
  let repository: TsMorphEntityDefinitionRepository;

  beforeEach(() => {
    repository = new TsMorphEntityDefinitionRepository();
  });
  
  const getTestFiles = (directoryPath: string): string[] => {
    return readdirSync(directoryPath)
      .filter((file) => file.endsWith('.ts'))
      .map((file) => join(directoryPath, file));
  };
  
  describe('find', () => {
    it('should return an array of EntityDefinition', async () => {
      const path = './testdata/src/domain/entities';
      const files = getTestFiles(path);
      const result = await repository.find(files);

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
              name: 'cachedDetail',
              propertyType: 'struct',
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
            {
              isArray: false,
              isNullable: false,
              isReference: false,
              isUnique: false,
              name: 'content',
              propertyType: 'typedStruct',
              structTypeName: 'Content',
            },
            {
              isArray: false,
              isNullable: false,
              isReference: false,
              isUnique: false,
              name: 'unionedContent',
              propertyType: 'typedStruct',
              structTypeName: 'SubContentA | SubContentB',
            },
            {
              isArray: false,
              isNullable: false,
              isReference: false,
              isUnique: false,
              name: 'combined',
              propertyType: 'typedStruct',
              structTypeName: 'Combined',
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
              acceptableValues: ['true'],
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

    it('spits error', async () => {
      const path = './testdata/src/domain/errors';
      const files = getTestFiles(path);
      await expect(repository.find(files)).rejects.toThrow(
        "Union types are not the same for property: invalidUnion: 'hoge' | 10;, types: string, number",
      );
    });

    // 追加: 判別子 Foo['type'] から acceptableValues を抽出できること
    it("extracts acceptableValues from discriminant via Foo['type']", async () => {
      const path = './testdata/src/domain/type_reference/Discriminant.ts';
      const files = [path];
      const result = await repository.find(files);

      const msg = result.find((e) => e.name === 'Discriminant');
      if (!msg) {
        throw new Error('Discriminant not found');
      }

      // contentType が string で、判別子 'type' のリテラル列挙を acceptableValues に持つ
      expect(msg).toEqual({
        name: 'Discriminant',
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
            name: 'userId',
            propertyType: 'string',
          },
          {
            acceptableValues: ['typeA', 'typeB', 'typeC'],
            isUnique: false,
            isNullable: false,
            isReference: false,
            isArray: false,
            name: 'contentType',
            propertyType: 'string',
          },
          {
            isArray: false,
            isNullable: false,
            isReference: false,
            isUnique: false,
            name: 'commonAttribute',
            propertyType: 'typedStruct',
            structTypeName: 'CommonAttributes',
          },
          {
            isArray: false,
            isNullable: false,
            isReference: false,
            isUnique: false,
            name: 'content',
            propertyType: 'typedStruct',
            structTypeName: 'DiscriminantContent',
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
            acceptableValues: null,
            isUnique: false,
            isNullable: false,
            isReference: false,
            isArray: false,
            name: 'updatedAt',
            propertyType: 'Date',
          },
        ],
      });
    });

    it('flattens intersection/extends for UsecaseTable* types', async () => {
      const path = './testdata/src/domain/type_reference/Intersection.ts';
      const files = [path];
      const result = await repository.find(files);

      expect(result).toEqual([
        {
          name: 'Intersection',
          properties: [
            { isReference: false, name: 'id', propertyType: 'Id' },
            {
              acceptableValues: null,
              isUnique: false,
              isNullable: false,
              isReference: false,
              isArray: false,
              name: 'fileId',
              propertyType: 'string',
            },
            {
              acceptableValues: null,
              isUnique: false,
              isNullable: false,
              isReference: false,
              isArray: true,
              name: 'chunkIds',
              propertyType: 'string',
            },
            {
              acceptableValues: null,
              isUnique: false,
              isNullable: false,
              isReference: false,
              isArray: false,
              name: 'strStacks',
              propertyType: 'struct',
            },
            {
              acceptableValues: null,
              isUnique: false,
              isNullable: false,
              isReference: false,
              isArray: false,
              name: 'year',
              propertyType: 'number',
            },
            {
              isArray: false,
              isNullable: false,
              isReference: false,
              isUnique: false,
              name: 'content',
              propertyType: 'typedStruct',
              structTypeName: 'IntersectionContent',
            },
            {
              acceptableValues: null,
              isArray: false,
              isNullable: true,
              isReference: false,
              isUnique: false,
              name: 'nameType',
              propertyType: 'string',
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
        .flatMap((s) => s.getTypeAliases())[0];
      userAddressType.getType().getPropertyOrThrow('id');

      const getPropertyType = (name: string): PropertyTypeDeclaration => {
        const property = userAddressType
          .getDescendantsOfKind(ts.SyntaxKind.PropertySignature)
          .find((p) => p.getName() === name);
        if (!property) {
          throw new Error(`Property ${name} not found.`);
        }
        return repository.getPropertyTypeDeclaration(property);
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
  describe('isReferencePropertyByTypeDeclaration', () => {
    it.each([
      { typeText: "User['id']", expected: true },
      { typeText: 'User["id"]', expected: true },
      { typeText: 'User | undefined', expected: false },
      { typeText: 'User["test"]', expected: false },
    ])(
      'returns $expected for type declaration $typeText',
      ({ typeText, expected }: { typeText: string; expected: boolean }) => {
        // return typeDecl.indexedAccess?.index.typeText === "'id'"
        const project = new ts.Project();
        const sourceFile = project.createSourceFile(
          'Temp.ts',
          `type Temp = { user: ${typeText} }`,
          { overwrite: true },
        );
        const typeAlias = sourceFile.getTypeAliases()[0];
        const property = typeAlias
          ?.getDescendantsOfKind(ts.SyntaxKind.PropertySignature)
          .find((p) => p.getName() === 'user');
        if (!property) {
          throw new Error('Property user not found.');
        }
        const propertyType = repository.getPropertyTypeDeclaration(property);
        expect(
          repository.isReferencePropertyByTypeDeclaration(propertyType),
        ).toBe(expected);
      },
    );
  });
});
