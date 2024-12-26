// ./src/domain/entities/EntityPropertyDefinition.ts
export type EntityPropertyDefinition =
  | EntityPropertyDefinitionId
  | EntityPropertyDefinitionPrimitive
  | EntityPropertyDefinitionReferencedObject;
export type EntityPropertyDefinitionId = {
  isReference: false;
  propertyType: 'Id';
  name: string;
};
export type EntityPropertyDefinitionPrimitive = {
  isReference: false;
  propertyType: 'boolean' | 'number' | 'string' | 'Date' | 'struct'
  name: string;
  isUnique: boolean;
  isNullable: boolean;
  isArray: boolean;
  acceptableValues: string[] | null;
}
export type EntityPropertyDefinitionReferencedObject = {
  isReference: true;
  name: string;
  targetEntityDefinitionName: string;
  isUnique: boolean;
  isNullable: boolean;
};
