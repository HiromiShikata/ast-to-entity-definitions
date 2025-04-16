export type Invalid = {
  id: string;
  invalidUnion: 'hoge' | 10;
  invalidUnionNullable: 'fuga' | false | null;
};
