import { TsMorphEntityDefinitionRepository } from './TsMorphEntityDefinitionRepository';

describe('TsMorphEntityDefinitionRepository', () => {
  let repository: TsMorphEntityDefinitionRepository;

  beforeEach(() => {
    repository = new TsMorphEntityDefinitionRepository();
  });

  describe('find', () => {
    it('should return an array of EntityDefinition', async () => {
      const path = './testdata/src/domain/entities';
      const result = await repository.find(path);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(4);

      const typeNames = result.map((item) => item.typeName);
      expect(typeNames).toContain('User');
      expect(typeNames).toContain('Group');
      expect(typeNames).toContain('UserGroup');
      expect(typeNames).toContain('UserAddress');

      result.forEach((item) => {
        expect(Array.isArray(item.properties)).toBe(true);
        item.properties.forEach((property) => {
          expect(typeof property.name).toBe('string');
          expect(typeof property.propertyType).toBe('string');
        });
      });

      const userTypeDef = result.find((item) => item.typeName === 'User');
      expect(userTypeDef).toBeDefined();
      expect(userTypeDef?.properties).toContainEqual({
        name: 'id',
        propertyType: 'string',
        isReference: false,
      });
      expect(userTypeDef?.properties).toContainEqual({
        name: 'name',
        propertyType: 'string',
        isReference: false,
      });
      expect(userTypeDef?.properties).toContainEqual({
        name: 'deactivated',
        propertyType: 'boolean',
        isReference: false,
      });

      const groupTypeDef = result.find((item) => item.typeName === 'Group');
      expect(groupTypeDef).toBeDefined();
      expect(groupTypeDef?.properties).toContainEqual({
        name: 'id',
        propertyType: 'string',
        isReference: false,
      });
      expect(groupTypeDef?.properties).toContainEqual({
        name: 'name',
        propertyType: 'string',
        isReference: false,
      });

      const userGroupTypeDef = result.find(
        (item) => item.typeName === 'UserGroup',
      );
      expect(userGroupTypeDef).toBeDefined();
      expect(userGroupTypeDef?.properties).toContainEqual({
        name: 'id',
        propertyType: 'string',
        isReference: false,
      });
      expect(userGroupTypeDef?.properties).toContainEqual({
        name: 'userId',
        propertyType: 'User',
        isReference: true,
        isUnique: false,
      });
      expect(userGroupTypeDef?.properties).toContainEqual({
        name: 'groupId',
        propertyType: 'Group',
        isReference: true,
        isUnique: false,
      });

      const userAddressTypeDef = result.find(
        (item) => item.typeName === 'UserAddress',
      );
      expect(userAddressTypeDef).toBeDefined();
      expect(userAddressTypeDef?.properties).toContainEqual({
        name: 'id',
        propertyType: 'string',
        isReference: false,
      });
      expect(userAddressTypeDef?.properties).toContainEqual({
        name: 'userId',
        propertyType: `User`,
        isUnique: true,
        isReference: true,
      });
      expect(userAddressTypeDef?.properties).toContainEqual({
        name: 'address',
        propertyType: 'string',
        isReference: false,
      });
    });
  });
});
