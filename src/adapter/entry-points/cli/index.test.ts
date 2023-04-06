import { execSync } from 'child_process';

describe('commander program', () => {
  it('should output file contents', () => {
    const output = execSync(
      'npx ts-node ./src/adapter/entry-points/cli/index.ts ./testdata/src/domain/entities',
    ).toString();

    expect(output.trim()).toBe(
      JSON.stringify([
        {
          name: 'Group',
          properties: [
            {
              isReference: false,
              name: 'id',
              propertyType: 'string',
              isNullable: false,
              acceptableValues: null,
            },
            {
              isReference: false,
              name: 'name',
              propertyType: 'string',
              isNullable: false,
              acceptableValues: null,
            },
            {
              isReference: false,
              name: 'category',
              propertyType: 'string',
              isNullable: false,
              acceptableValues: ['Sports', 'Music', 'Movies'],
            },
          ],
        },
        {
          name: 'Item',
          properties: [
            {
              isReference: false,
              name: 'id',
              propertyType: 'string',
              isNullable: false,
              acceptableValues: null,
            },
            {
              isReference: false,
              name: 'name',
              propertyType: 'string',
              isNullable: false,
              acceptableValues: null,
            },
          ],
        },
        {
          name: 'User',
          properties: [
            {
              isReference: false,
              name: 'id',
              propertyType: 'string',
              isNullable: false,
              acceptableValues: null,
            },
            {
              isReference: false,
              name: 'name',
              propertyType: 'string',
              isNullable: false,
              acceptableValues: null,
            },
            {
              isReference: false,
              name: 'deactivated',
              propertyType: 'boolean',
              isNullable: false,
              acceptableValues: ['false', 'true'],
            },
            {
              isReference: false,
              name: 'createdAt',
              propertyType: 'Date',
              isNullable: false,
              acceptableValues: null,
            },
          ],
        },
        {
          name: 'UserAddress',
          properties: [
            {
              isReference: false,
              name: 'id',
              propertyType: 'string',
              isNullable: false,
              acceptableValues: null,
            },
            {
              isReference: true,
              name: 'userId',
              targetEntityDefinitionName: 'User',
              isUnique: true,
              isNullable: false,
            },
            {
              isReference: false,
              name: 'address',
              propertyType: 'string',
              isNullable: false,
              acceptableValues: null,
            },
            {
              isReference: false,
              name: 'stringLiteral',
              propertyType: 'string',
              isNullable: false,
              acceptableValues: null,
            },
            {
              isReference: false,
              name: 'numberLiteral',
              propertyType: 'number',
              isNullable: false,
              acceptableValues: null,
            },
            {
              isReference: false,
              name: 'booleanLiteral',
              propertyType: 'boolean',
              isNullable: false,
              acceptableValues: null,
            },
            {
              isReference: false,
              name: 'nullableWithNullUnion',
              propertyType: 'string',
              isNullable: true,
              acceptableValues: null,
            },
            {
              isReference: false,
              name: 'nullableWithUndefined',
              propertyType: 'string',
              isNullable: true,
              acceptableValues: null,
            },
            {
              isReference: false,
              name: 'nullableWithQuestionMark',
              propertyType: 'string',
              isNullable: true,
              acceptableValues: null,
            },
            {
              isReference: false,
              name: 'unionLiteralsWithSameTypeNullable',
              propertyType: 'string',
              isNullable: true,
              acceptableValues: ['dog', 'cat'],
            },
            {
              isReference: false,
              name: 'unionLiteralsWithSameTypeQuestionMark',
              propertyType: 'string',
              isNullable: true,
              acceptableValues: ['dog', 'cat'],
            },
            {
              isReference: false,
              name: 'unionLiteralsWithSameType',
              propertyType: 'string',
              isNullable: false,
              acceptableValues: ['dog', 'cat'],
            },
          ],
        },
        {
          name: 'UserGroup',
          properties: [
            {
              isReference: false,
              name: 'id',
              propertyType: 'string',
              isNullable: false,
              acceptableValues: null,
            },
            {
              isReference: true,
              name: 'userId',
              targetEntityDefinitionName: 'User',
              isUnique: false,
              isNullable: false,
            },
            {
              isReference: true,
              name: 'groupId',
              targetEntityDefinitionName: 'Group',
              isUnique: false,
              isNullable: false,
            },
          ],
        },
      ]),
    );
  });
});
