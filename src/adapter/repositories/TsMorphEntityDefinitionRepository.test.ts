import { TsMorphEntityDefinitionRepository } from './TsMorphEntityDefinitionRepository';

describe('TsMorphTypeDefinitionAstRepository', () => {
  let repository: TsMorphEntityDefinitionRepository;

  beforeEach(() => {
    repository = new TsMorphEntityDefinitionRepository();
  });

  describe('find', () => {
    it('should return an array of TypeDefinitionAst', async () => {
      const path = './testdata/src/domain/entities';
      const result = await repository.find(path);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3);

      const typeNames = result.map((item) => item.typeName);
      expect(typeNames).toContain('User');
      expect(typeNames).toContain('Group');
      expect(typeNames).toContain('UserGroup');

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
      });
      expect(userTypeDef?.properties).toContainEqual({
        name: 'name',
        propertyType: 'string',
      });
      expect(userTypeDef?.properties).toContainEqual({
        name: 'deactivated',
        propertyType: 'boolean',
      });

      const groupTypeDef = result.find((item) => item.typeName === 'Group');
      expect(groupTypeDef).toBeDefined();
      expect(groupTypeDef?.properties).toContainEqual({
        name: 'id',
        propertyType: 'string',
      });
      expect(groupTypeDef?.properties).toContainEqual({
        name: 'name',
        propertyType: 'string',
      });

      const userGroupTypeDef = result.find(
        (item) => item.typeName === 'UserGroup',
      );
      expect(userGroupTypeDef).toBeDefined();
      expect(userGroupTypeDef?.properties).toContainEqual({
        name: 'id',
        propertyType: 'string',
      });
      expect(userGroupTypeDef?.properties).toContainEqual({
        name: 'userId',
        propertyType: 'User',
      });
      expect(userGroupTypeDef?.properties).toContainEqual({
        name: 'groupId',
        propertyType: 'Group',
      });
    });
  });
});
