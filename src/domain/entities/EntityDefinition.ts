export type EntityDefinition =
  | EntityDefinitionPrimitive
  | EntityDefinitionObject;

export type EntityDefinitionPrimitive = {
  name: 'string' | 'number' | 'boolean';
  isPrimitive: true;
};
export type EntityDefinitionObject = {
  name: string;
  isPrimitive: false;
};
