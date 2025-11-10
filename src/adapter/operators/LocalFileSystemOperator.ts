import { readdirSync, statSync } from 'fs';
import { join } from 'path';
import { FileSystemOperator } from '../../domain/usecases/adapter-interfaces/FileSystemOperator';

export class LocalFileSystemOperator implements FileSystemOperator {
  list(directoryPath: string): string[] {
    const stats = statSync(directoryPath);

    if (!stats.isDirectory()) {
      throw new Error(`Path is not a directory: ${directoryPath}`);
    }

    const files = readdirSync(directoryPath);
    return files
      .filter((file) => file.endsWith('.ts'))
      .map((file) => join(directoryPath, file));
  }
}
