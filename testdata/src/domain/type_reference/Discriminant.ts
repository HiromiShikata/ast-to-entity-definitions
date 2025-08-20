import type { Id } from 'ast-to-entity-definitions';

type CommonAttributes = {
  aa: string;
  bb: number;
};

//
// 判別共用体: DiscriminantContent
//
export type DiscriminantContentTypeA = {
  type: 'typeA';
  common: CommonAttributes;
  prompt: string;
};

export type DiscriminantContentTypeB = {
  type: 'typeB';
  common: CommonAttributes;
  answer: string;
};

export type DiscriminantContentTypeC = {
  type: 'typeC';
  common: CommonAttributes;
  overview: string;
};

export type DiscriminantContent =
  | DiscriminantContentTypeA
  | DiscriminantContentTypeB
  | DiscriminantContentTypeC

//
// 本体
//
export type Discriminant = {
  id: Id;
  userId: string;
  contentType: DiscriminantContent['type'];
  commonAttribute: DiscriminantContent['common'];
  content: DiscriminantContent;
  createdAt: Date;
  updatedAt: Date;
};
