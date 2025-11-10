export interface FileSystemOperator {
  list(directoryPath: string): string[];
}
