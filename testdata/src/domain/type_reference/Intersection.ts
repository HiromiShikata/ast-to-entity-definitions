import type { Id } from 'ast-to-entity-definitions';

type Common = {
  id: Id;
  fileId: string;
  chunkIds: string[];
  strStacks: object;
  year: number;
};

type IntersectionContent = {
  name: string | null;
  count: number;
};

//
// 本体
//
export type Intersection = Common & {
  content: IntersectionContent;
  nameType: IntersectionContent['name'];
};
