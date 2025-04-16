import type { Id } from 'ast-to-entity-definitions';

type Content = {
  title: string;
  body: string;
};

type SubContentA = {
  subTitle: string;
};
type SubContentB = {
  subTitle: string;
  body: string;
};

type Combined = SubContentA | SubContentB;

export interface Item {
  id: Id;
  name: string;
  content: Content;
  unionedContent: SubContentA | SubContentB;
  combined: Combined;
}
