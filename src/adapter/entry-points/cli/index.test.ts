import { execSync } from 'child_process';
import { EntityDefinition } from '../function';

describe('commander program', () => {
  it('should output file contents', () => {
    const output = execSync(
      'npx ts-node ./src/adapter/entry-points/cli/index.ts ./testdata/src/domain/entities',
    ).toString();

    // output should be parsed as JSON
    const parsedOutput = JSON.parse(output) as EntityDefinition[]; // eslint-disable-line no-type-assertion/no-type-assertion
    expect(parsedOutput).toEqual<EntityDefinition[]>([
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
            isNullable: false,
            isReference: false,
            isArray: false,
            name: 'role',
            propertyType: 'string',
          },
          {
            acceptableValues: null,
            isNullable: false,
            isReference: false,
            isArray: false,
            name: 'deactivated',
            propertyType: 'boolean',
          },
          {
            acceptableValues: null,
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
            isNullable: false,
            isReference: false,
            isArray: false,
            name: 'name',
            propertyType: 'string',
          },
          {
            acceptableValues: ['Sports', 'Music', 'Movies'],
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
            isNullable: false,
            isReference: false,
            isArray: false,
            name: 'name',
            propertyType: 'string',
          },
          {
            acceptableValues: null,
            isNullable: false,
            isReference: false,
            isArray: false,
            name: 'deactivated',
            propertyType: 'boolean',
          },
          {
            acceptableValues: null,
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
            isNullable: false,
            isReference: false,
            isArray: false,
            name: 'address',
            propertyType: 'string',
          },
          {
            acceptableValues: null,
            isArray: true,
            isNullable: false,
            isReference: false,
            name: 'stringArray',
            propertyType: 'string',
          },
          {
            acceptableValues: null,
            isArray: true,
            isNullable: false,
            isReference: false,
            name: 'numberArray',
            propertyType: 'number',
          },
          {
            acceptableValues: null,
            isArray: true,
            isNullable: false,
            isReference: false,
            name: 'booleanArray',
            propertyType: 'boolean',
          },
          {
            acceptableValues: null,
            isArray: true,
            isNullable: false,
            isReference: false,
            name: 'dateArray',
            propertyType: 'Date',
          },
          {
            acceptableValues: ['home'],
            isNullable: false,
            isReference: false,
            isArray: false,
            name: 'stringLiteral',
            propertyType: 'string',
          },
          {
            acceptableValues: ['1'],
            isNullable: false,
            isReference: false,
            isArray: false,
            name: 'numberLiteral',
            propertyType: 'number',
          },
          {
            acceptableValues: null,
            isNullable: false,
            isReference: false,
            isArray: false,
            name: 'booleanLiteral',
            propertyType: 'boolean',
          },
          {
            acceptableValues: null,
            isNullable: true,
            isReference: false,
            isArray: false,
            name: 'nullableWithNullUnion',
            propertyType: 'string',
          },
          {
            acceptableValues: null,
            isNullable: true,
            isReference: false,
            isArray: false,
            name: 'nullableWithUndefined',
            propertyType: 'string',
          },
          {
            acceptableValues: null,
            isNullable: true,
            isReference: false,
            isArray: false,
            name: 'nullableWithQuestionMark',
            propertyType: 'string',
          },
          {
            acceptableValues: ['dog', 'cat'],
            isNullable: true,
            isReference: false,
            isArray: false,
            name: 'unionLiteralsWithSameTypeNullable',
            propertyType: 'string',
          },
          {
            acceptableValues: ['dog', 'cat'],
            isNullable: true,
            isReference: false,
            isArray: false,
            name: 'unionLiteralsWithSameTypeQuestionMark',
            propertyType: 'string',
          },
          {
            acceptableValues: ['dog', 'cat'],
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
