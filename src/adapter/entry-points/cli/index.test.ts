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
            },
            {
              isReference: false,
              name: 'name',
              propertyType: 'string',
              isNullable: false,
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
            },
            {
              isReference: false,
              name: 'name',
              propertyType: 'string',
              isNullable: false,
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
            },
            {
              isReference: false,
              name: 'name',
              propertyType: 'string',
              isNullable: false,
            },
            {
              isReference: false,
              name: 'deactivated',
              propertyType: 'boolean',
              isNullable: false,
            },
            {
              isReference: false,
              name: 'createdAt',
              propertyType: 'Date',
              isNullable: false,
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
            },
            {
              isReference: false,
              name: 'stringLiteral',
              propertyType: 'string',
              isNullable: false,
            },
            {
              isReference: false,
              name: 'numberLiteral',
              propertyType: 'number',
              isNullable: false,
            },
            {
              isReference: false,
              name: 'booleanLiteral',
              propertyType: 'boolean',
              isNullable: false,
            },
            {
              isReference: false,
              name: 'nullableWithNullUnion',
              propertyType: 'string',
              isNullable: true,
            },
            {
              isReference: false,
              name: 'nullableWithUndefined',
              propertyType: 'string',
              isNullable: true,
            },
            {
              isReference: false,
              name: 'nullableWithQuestionMark',
              propertyType: 'string',
              isNullable: true,
            },
            {
              isReference: false,
              name: 'unionLiteralsWithSameTypeNullable',
              propertyType: 'string',
              isNullable: true,
            },
            {
              isReference: false,
              name: 'unionLiteralsWithSameTypeQuestionMark',
              propertyType: 'string',
              isNullable: true,
            },
            {
              isReference: false,
              name: 'unionLiteralsWithSameType',
              propertyType: 'string',
              isNullable: false,
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
