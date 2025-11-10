import { LocalFileSystemOperator } from './LocalFileSystemOperator';
import { join } from 'path';

describe('LocalFileSystemOperator', () => {
  let operator: LocalFileSystemOperator;

  beforeEach(() => {
    operator = new LocalFileSystemOperator();
  });

  describe('list', () => {
    it('should return list of .ts files in directory', () => {
      const directoryPath = './testdata/src/domain/entities';
      const result = operator.list(directoryPath);

      expect(result.length).toBeGreaterThan(0);
      expect(result.every((file) => file.endsWith('.ts'))).toBe(true);
      expect(
        result.some((file) => file.includes('User.ts')),
      ).toBe(true);
    });

    it('should return absolute paths', () => {
      const directoryPath = './testdata/src/domain/entities';
      const result = operator.list(directoryPath);

      expect(result.length).toBeGreaterThan(0);
      result.forEach((file) => {
        expect(file).toContain(join(directoryPath, ''));
      });
    });

    it('should throw error if path is not a directory', () => {
      const filePath = './testdata/src/domain/entities/User.ts';
      
      expect(() => operator.list(filePath)).toThrow('Path is not a directory');
    });
  });
});
