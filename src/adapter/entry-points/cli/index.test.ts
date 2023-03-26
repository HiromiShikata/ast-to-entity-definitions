import { execSync } from 'child_process';

describe('commander program', () => {
  it('should output file contents', () => {
    const output = execSync(
      'npx ts-node ./src/adapter/entry-points/cli/index.ts ./testdata/src/domain/entities',
    ).toString();

    expect(output.trim()).toBe(
      `[{"typeName":"Group","properties":[{"isReference":false,"name":"id","propertyType":"string"},{"isReference":false,"name":"name","propertyType":"string"}]},{"typeName":"User","properties":[{"isReference":false,"name":"id","propertyType":"string"},{"isReference":false,"name":"name","propertyType":"string"},{"isReference":false,"name":"deactivated","propertyType":"boolean"}]},{"typeName":"UserAddress","properties":[{"isReference":false,"name":"id","propertyType":"string"},{"isReference":true,"name":"userId","propertyType":"User","isUnique":true},{"isReference":false,"name":"address","propertyType":"string"}]},{"typeName":"UserGroup","properties":[{"isReference":false,"name":"id","propertyType":"string"},{"isReference":true,"name":"userId","propertyType":"User","isUnique":false},{"isReference":true,"name":"groupId","propertyType":"Group","isUnique":false}]}]`,
    );
  });
});
