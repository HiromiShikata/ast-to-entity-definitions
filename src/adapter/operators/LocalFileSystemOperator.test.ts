import { LocalFileSystemOperator } from './LocalFileSystemOperator';

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
      expect(result.some((file) => file.includes('User.ts'))).toBe(true);
    });

    it('should return paths that include directory path', () => {
      const directoryPath = './testdata/src/domain/entities';
      const result = operator.list(directoryPath);

      expect(result.length).toBeGreaterThan(0);
      result.forEach((file) => {
        // Verify the path contains the directory name components
        expect(file).toContain('testdata');
        expect(file).toContain('entities');
        expect(file.endsWith('.ts')).toBe(true);
      });
    });

    it('should throw error if path is not a directory', () => {
      const filePath = './testdata/src/domain/entities/User.ts';

      expect(() => operator.list(filePath)).toThrow('Path is not a directory');
    });
  });
});
