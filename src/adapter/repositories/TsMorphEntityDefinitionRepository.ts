// ./src/adapter/repositories/TsMorphEntityDefinitionRepository.ts
import * as ts from 'ts-morph';
import { Node, SyntaxKind } from 'ts-morph';
import { readdirSync, statSync } from 'fs';
import { EntityDefinition } from '../../domain/entities/EntityDefinition';
import { EntityDefinitionRepository } from '../../domain/usecases/adapter-interfaces/EntityDefinitionRepository';
import {
  EntityPropertyDefinition,
  EntityPropertyDefinitionPrimitive,
} from '../../domain/entities/EntityPropertyDefinition';
import { excludeNull } from '../../lib/collection';

export type PropertyTypeDeclaration = {
  hasQuestionMark: boolean;
  annotationText: string | null;
  isArray: boolean;
  arrayElement: Omit<PropertyTypeDeclaration, 'hasQuestionMark'> | null;
  union: Omit<PropertyTypeDeclaration, 'hasQuestionMark'>[] | null;
  indexedAccess: {
    index: Omit<PropertyTypeDeclaration, 'hasQuestionMark'>;
    object: Omit<PropertyTypeDeclaration, 'hasQuestionMark'>;
  } | null;
  node: ts.Node;
  typeText: string;
};

export class TsMorphEntityDefinitionRepository
  implements EntityDefinitionRepository
{
  private readonly project: ts.Project;

  constructor() {
    this.project = new ts.Project();
  }

  async find(path: string): Promise<EntityDefinition[]> {
    const stats = statSync(path);
    if (stats.isDirectory()) {
      const files = readdirSync(path).filter((file) => file.endsWith('.ts'));
      for (const file of files) {
        const filePath = `${path}/${file}`;
        this.project.addSourceFileAtPath(filePath);
      }
    } else if (stats.isFile() && path.endsWith('.ts')) {
      this.project.addSourceFileAtPath(path);
    } else {
      throw new Error('Invalid path');
    }

    const targets = this.project
      .getSourceFiles()
      .flatMap((sf) => [
        ...sf.getTypeAliases().filter((t) => t.isExported()),
        ...sf.getInterfaces().filter((i) => i.isExported()),
      ]);

    const typeDefinitionAsts: EntityDefinition[] = targets
      .filter((decl) => this.declRepresentsObjectLike(decl))
      .map((decl) => {
        const entityName = decl.getName();
        const properties = this.collectFlattenedPropertySignatures(decl)
          .map((property): EntityPropertyDefinition | null => {
            const propertyName = property.getName();
            const typeDecl = this.getPropertyTypeDeclaration(property);

            if (typeDecl.typeText === 'Id') {
              return {
                isReference: false,
                name: propertyName,
                propertyType: 'Id',
              };
            }

            const isUnique = this.isUnique(typeDecl);
            const isNullable = this.isNullable(typeDecl);
            const isArray = typeDecl.isArray;

            if (
              typeDecl.indexedAccess &&
              this.isReferencePropertyByTypeDeclaration(typeDecl)
            ) {
              return {
                isReference: true,
                name: propertyName,
                targetEntityDefinitionName:
                  typeDecl.indexedAccess.object.typeText,
                isUnique,
                isNullable,
              };
            }
            const unionedId = typeDecl.union?.find((t) =>
              this.isReferencePropertyByTypeDeclaration(t),
            );
            if (unionedId?.indexedAccess) {
              return {
                isReference: true,
                name: propertyName,
                targetEntityDefinitionName:
                  unionedId.indexedAccess.object.typeText,
                isUnique,
                isNullable,
              };
            }

            if (typeDecl.indexedAccess) {
              const resolvedTypeDecl =
                this.resolveIndexedAccessTypeToPropertyTypeDeclaration(
                  typeDecl.indexedAccess,
                );
              if (resolvedTypeDecl) {
                const resolvedNullable = this.isNullable(resolvedTypeDecl);
                const resolvedArray = resolvedTypeDecl.isArray;
                const primitiveType =
                  this.decideTypeForPrimitive(resolvedTypeDecl);

                if (primitiveType) {
                  const acceptableValues =
                    this.getAcceptableValues(resolvedTypeDecl);
                  return {
                    isReference: false,
                    name: propertyName,
                    propertyType: primitiveType,
                    isUnique,
                    isNullable: isNullable || resolvedNullable,
                    isArray: isArray || resolvedArray,
                    acceptableValues,
                  };
                }

                return {
                  isReference: false,
                  name: propertyName,
                  propertyType: 'typedStruct',
                  structTypeName: resolvedTypeDecl.typeText,
                  isUnique,
                  isNullable: isNullable || resolvedNullable,
                  isArray: isArray || resolvedArray,
                };
              }
            }

            const primitiveTypeText = this.decideTypeForPrimitive(typeDecl);
            if (primitiveTypeText) {
              const acceptableValues = this.getAcceptableValues(typeDecl);
              return {
                isReference: false,
                name: propertyName,
                propertyType: primitiveTypeText,
                isUnique,
                isNullable,
                isArray,
                acceptableValues,
              };
            }

            return {
              isReference: false,
              name: propertyName,
              propertyType: 'typedStruct',
              structTypeName: typeDecl.typeText,
              isUnique,
              isNullable,
              isArray,
            };
          })
          .filter((x): x is EntityPropertyDefinition => x !== null);

        return { name: entityName, properties };
      });

    return typeDefinitionAsts;
  }

  private declRepresentsObjectLike(
    decl: ts.TypeAliasDeclaration | ts.InterfaceDeclaration,
  ): boolean {
    if (Node.isInterfaceDeclaration(decl)) return true;
    const tn = decl.getTypeNode();
    if (!tn) return false;

    if (tn.isKind(SyntaxKind.TypeLiteral)) return true;
    if (tn.isKind(SyntaxKind.IntersectionType)) return true;
    if (tn.isKind(SyntaxKind.TypeReference)) {
      const ref = this.resolveTypeReferenceNode(tn);
      return !!ref && this.declRepresentsObjectLike(ref);
    }
    return false;
  }

  private collectFlattenedPropertySignatures(
    decl: ts.TypeAliasDeclaration | ts.InterfaceDeclaration,
  ): ts.PropertySignature[] {
    const seen = new Set<string>();
    const out: ts.PropertySignature[] = [];

    const pushUnique = (ps: ts.PropertySignature[]) => {
      for (const p of ps) {
        const key = `${p.getName()}@${p
          .getSourceFile()
          .getFilePath()}:${p.getStartLineNumber()}`;
        if (!seen.has(key)) {
          seen.add(key);
          out.push(p);
        }
      }
    };

    if (Node.isInterfaceDeclaration(decl)) {
      pushUnique(decl.getProperties());
      for (const ext of decl.getExtends()) {
        const expr = ext.getExpression();
        if (Node.isIdentifier(expr)) {
          const target = this.lookupAliasOrInterfaceByName(expr.getText());
          if (target)
            pushUnique(this.collectFlattenedPropertySignatures(target));
        }
      }
      return out;
    }

    const tn = decl.getTypeNode();
    if (!tn) return out;

    const rec = (node: ts.TypeNode) => {
      if (node.isKind(SyntaxKind.TypeLiteral)) {
        const tl = node;
        const members = tl.getMembers().filter(Node.isPropertySignature);
        pushUnique(members);
        return;
      }
      if (node.isKind(SyntaxKind.IntersectionType)) {
        node.getTypeNodes().forEach(rec);
        return;
      }
      if (node.isKind(SyntaxKind.TypeReference)) {
        const target = this.resolveTypeReferenceNode(node);
        if (target) pushUnique(this.collectFlattenedPropertySignatures(target));
        return;
      }
    };

    rec(tn);
    return out;
  }

  private resolveTypeReferenceNode(
    ref: ts.TypeReferenceNode,
  ): ts.TypeAliasDeclaration | ts.InterfaceDeclaration | null {
    const name = ref.getTypeName().getText();
    return this.lookupAliasOrInterfaceByName(name);
  }

  private lookupAliasOrInterfaceByName(
    name: string,
  ): ts.TypeAliasDeclaration | ts.InterfaceDeclaration | null {
    for (const sf of this.project.getSourceFiles()) {
      const ta = sf.getTypeAlias(name);
      if (ta) return ta;
      const intf = sf.getInterface(name);
      if (intf) return intf;
    }
    return null;
  }

  getGenericTypeNode = (
    typeDeclaration: ts.Node,
  ): { typeNameText: string; typeArgumentNode: ts.TypeNode } | null => {
    if (!typeDeclaration.isKind(SyntaxKind.TypeReference)) return null;
    const typeArgumentNode =
      typeDeclaration?.getChildCount() > 0
        ? typeDeclaration?.getTypeArguments()?.[0] ?? null
        : null;
    if (!typeArgumentNode) return null;
    const typeNameText = typeDeclaration.getTypeName().getText();
    if (!typeNameText) return null;
    return { typeNameText, typeArgumentNode };
  };

  getIndexedAccessTypeNode = (
    typeDeclaration: ts.Node,
  ): { indexTypeNode: ts.TypeNode; objectTypeNode: ts.TypeNode } | null => {
    if (!typeDeclaration.isKind(SyntaxKind.IndexedAccessType)) return null;
    const i = typeDeclaration;
    const indexTypeNode = i.getIndexTypeNode();
    const objectTypeNode = i.getObjectTypeNode();
    return { indexTypeNode, objectTypeNode };
  };

  getPropertyTypeDeclarationRecursively = (
    typeDeclarationNode: ts.Node,
  ): Omit<PropertyTypeDeclaration, 'hasQuestionMark'> => {
    const genericTypeNode = this.getGenericTypeNode(typeDeclarationNode);
    const indexedAccessTypeNode = this.getIndexedAccessTypeNode(
      genericTypeNode?.typeArgumentNode ?? typeDeclarationNode,
    );

    const targetTypeDeclaration =
      genericTypeNode?.typeArgumentNode ??
      indexedAccessTypeNode?.objectTypeNode ??
      typeDeclarationNode;

    const annotationText = genericTypeNode?.typeNameText ?? null;

    const indexedAccess = indexedAccessTypeNode
      ? {
          index: this.getPropertyTypeDeclarationRecursively(
            indexedAccessTypeNode.indexTypeNode,
          ),
          object: this.getPropertyTypeDeclarationRecursively(
            indexedAccessTypeNode.objectTypeNode,
          ),
        }
      : null;

    const arrayElement = targetTypeDeclaration.isKind(SyntaxKind.ArrayType)
      ? this.getPropertyTypeDeclarationRecursively(
          targetTypeDeclaration.getElementTypeNode(),
        )
      : null;

    const union: PropertyTypeDeclaration['union'] = excludeNull(
      targetTypeDeclaration.isKind(SyntaxKind.UnionType)
        ? targetTypeDeclaration.getTypeNodes().map((t) => {
            return this.getPropertyTypeDeclarationRecursively(t);
          })
        : targetTypeDeclaration.isKind(SyntaxKind.LiteralType)
        ? [
            {
              annotationText: null,
              indexedAccess: null,
              isArray: false,
              arrayElement: null,
              node: targetTypeDeclaration,
              typeText: targetTypeDeclaration.getText(),
              union: null,
            },
          ]
        : [],
    );

    const typeText = targetTypeDeclaration.getText();

    return {
      annotationText,
      indexedAccess,
      union: union.length > 0 ? union : null,
      isArray: !!arrayElement,
      arrayElement,
      node: targetTypeDeclaration,
      typeText,
    };
  };

  getPropertyTypeDeclaration = (
    propertySignature: ts.PropertySignature,
  ): PropertyTypeDeclaration => {
    const typeDeclarationNode = propertySignature.getTypeNode();
    if (!typeDeclarationNode) {
      throw new Error(
        `Type declaration node is null for property signature: ${propertySignature.getText()}`,
      );
    }
    const base =
      this.getPropertyTypeDeclarationRecursively(typeDeclarationNode);
    const hasQuestionMark = propertySignature.hasQuestionToken();
    return { ...base, hasQuestionMark };
  };

  isUnique = (propertyTypeDeclaration: PropertyTypeDeclaration): boolean => {
    return propertyTypeDeclaration.annotationText === 'Unique';
  };

  isNullable = (propertyTypeDeclaration: PropertyTypeDeclaration): boolean => {
    if (propertyTypeDeclaration.hasQuestionMark) return true;
    return (
      propertyTypeDeclaration.union?.some((t) => {
        return t.node.getText() === 'null' || t.node.getText() === 'undefined';
      }) ?? false
    );
  };

  isArray = (valueDeclaration: Node): boolean => {
    return valueDeclaration.isKind(SyntaxKind.ArrayType);
  };

  primitiveTypeText = (
    text: string,
  ): 'boolean' | 'number' | 'string' | 'Date' | null => {
    if (
      text === 'boolean' ||
      text === 'number' ||
      text === 'string' ||
      text === 'Date'
    ) {
      return text;
    }
    return null;
  };

  getAcceptableValues = (
    propertyTypeDeclaration: PropertyTypeDeclaration,
  ): string[] | null => {
    if (
      propertyTypeDeclaration.union &&
      propertyTypeDeclaration.union.length > 0
    ) {
      const unionTypeTexts = excludeNull(
        propertyTypeDeclaration.union.map((t) => {
          if (!t.node.isKind(SyntaxKind.LiteralType)) return null;
          const text = t.node.getText().replace(/'/g, '').replace(/"/g, '');
          if (text === 'null' || text === 'undefined') return null;
          return text;
        }),
      );
      if (unionTypeTexts.length > 0) return unionTypeTexts;
    }
    return null;
  };

  decideTypeForPrimitive = (
    propertyTypeDeclaration: Omit<PropertyTypeDeclaration, 'hasQuestionMark'>,
  ): EntityPropertyDefinitionPrimitive['propertyType'] | null => {
    if (
      propertyTypeDeclaration.union &&
      propertyTypeDeclaration.union.length > 0
    ) {
      const unionTypes = propertyTypeDeclaration.union.map((t) => {
        return this.decideTypeForPrimitive(t);
      });
      const firstType = unionTypes[0];
      if (!firstType) return null;
      if (unionTypes.filter((t) => t !== null).some((t) => t !== firstType)) {
        throw new Error(
          `Union types are not the same for property: ${
            propertyTypeDeclaration.node.getParent()?.getText() || 'unknown'
          }, types: ${unionTypes.join(', ')}`,
        );
      }
      return firstType;
    }
    if (
      propertyTypeDeclaration.isArray &&
      propertyTypeDeclaration.arrayElement
    ) {
      return this.decideTypeForPrimitive(propertyTypeDeclaration.arrayElement);
    }
    const nt = propertyTypeDeclaration.node.getType();
    if (nt.isBoolean() || nt.isBooleanLiteral()) return 'boolean';
    if (nt.isNumber() || nt.isNumberLiteral()) return 'number';
    if (nt.isString() || nt.isStringLiteral()) return 'string';
    if (propertyTypeDeclaration.node.getText() === 'Date') return 'Date';
    if (propertyTypeDeclaration.node.getText() === 'object') return 'struct';
    return null;
  };

  private resolveIndexedAccessTypeToPropertyTypeDeclaration(indexedAccess: {
    index: Omit<PropertyTypeDeclaration, 'hasQuestionMark'>;
    object: Omit<PropertyTypeDeclaration, 'hasQuestionMark'>;
  }): PropertyTypeDeclaration | null {
    const indexText = indexedAccess.index.typeText.replace(/['"]/g, '');
    const objectTypeName = indexedAccess.object.typeText;

    const objectType = this.lookupAliasOrInterfaceByName(objectTypeName);
    if (!objectType) return null;

    if (Node.isTypeAliasDeclaration(objectType)) {
      const tn = objectType.getTypeNode();
      if (!tn) return null;

      if (tn.isKind(SyntaxKind.TypeLiteral)) {
        const props = tn.getMembers().filter(Node.isPropertySignature);
        const targetProp = props.find((p) => p.getName() === indexText);

        if (targetProp) {
          const propTypeNode = targetProp.getTypeNode();
          if (!propTypeNode) return null;

          const propTypeDecl =
            this.getPropertyTypeDeclarationRecursively(propTypeNode);
          return {
            ...propTypeDecl,
            hasQuestionMark: targetProp.hasQuestionToken(),
          };
        }
      }

      if (tn.isKind(SyntaxKind.UnionType)) {
        const values = new Set<string>();
        let hasQuestionMark = false;
        let commonTypeNode: ts.TypeNode | null = null;
        let commonTypeName: string | null = null;

        for (const memberNode of tn.getTypeNodes()) {
          const memberProps = this.getPropertiesFromTypeNode(memberNode);
          const targetProp = memberProps.find((p) => p.getName() === indexText);

          if (targetProp) {
            hasQuestionMark = hasQuestionMark || targetProp.hasQuestionToken();
            const propTypeNode = targetProp.getTypeNode();
            if (!propTypeNode) continue;

            if (propTypeNode.isKind(SyntaxKind.LiteralType)) {
              const value = propTypeNode.getText().replace(/['"]/g, '');
              if (value && value !== 'null' && value !== 'undefined') {
                values.add(value);
              }
            } else if (propTypeNode.isKind(SyntaxKind.UnionType)) {
              for (const unionMember of propTypeNode.getTypeNodes()) {
                if (unionMember.isKind(SyntaxKind.LiteralType)) {
                  const value = unionMember.getText().replace(/['"]/g, '');
                  if (value && value !== 'null' && value !== 'undefined') {
                    values.add(value);
                  }
                }
              }
            } else if (propTypeNode.isKind(SyntaxKind.TypeReference)) {
              const refName = propTypeNode.getTypeName().getText();
              if (!commonTypeName || commonTypeName === refName) {
                commonTypeName = refName;
                commonTypeNode = propTypeNode;
              }
            }
          }
        }

        if (values.size > 0) {
          const literalNodes = Array.from(values).map((value) => {
            const project = new ts.Project();
            const sourceFile = project.createSourceFile(
              'temp.ts',
              `type T = '${value}';`,
            );
            const typeAlias = sourceFile.getTypeAliasOrThrow('T');
            const literalNode = typeAlias.getTypeNodeOrThrow();

            return {
              annotationText: null,
              indexedAccess: null,
              isArray: false,
              arrayElement: null,
              node: literalNode,
              typeText: `'${value}'`,
              union: null,
            };
          });

          return {
            hasQuestionMark,
            annotationText: null,
            isArray: false,
            arrayElement: null,
            union: literalNodes.length > 0 ? literalNodes : null,
            indexedAccess: null,
            node: literalNodes[0].node,
            typeText:
              values.size === 1
                ? `'${Array.from(values)[0]}'`
                : Array.from(values)
                    .map((v) => `'${v}'`)
                    .join(' | '),
          };
        }

        if (commonTypeNode && commonTypeName) {
          const propTypeDecl =
            this.getPropertyTypeDeclarationRecursively(commonTypeNode);
          return {
            ...propTypeDecl,
            hasQuestionMark,
          };
        }
      }
    }

    return null;
  }

  private getPropertiesFromTypeNode(node: ts.TypeNode): ts.PropertySignature[] {
    const props: ts.PropertySignature[] = [];

    if (node.isKind(SyntaxKind.TypeLiteral)) {
      props.push(...node.getMembers().filter(Node.isPropertySignature));
    } else if (node.isKind(SyntaxKind.TypeReference)) {
      const ref = this.resolveTypeReferenceNode(node);
      if (ref) {
        props.push(...this.collectFlattenedPropertySignatures(ref));
      }
    } else if (node.isKind(SyntaxKind.IntersectionType)) {
      for (const t of node.getTypeNodes()) {
        props.push(...this.getPropertiesFromTypeNode(t));
      }
    }

    return props;
  }

  private tryExtractDiscriminantValuesFromIndexedAccess(
    propertyTypeDeclaration:
      | PropertyTypeDeclaration
      | Omit<PropertyTypeDeclaration, 'hasQuestionMark'>,
  ): string[] | null {
    if (propertyTypeDeclaration.indexedAccess?.index.typeText === "'type'") {
      const objectText = propertyTypeDeclaration.indexedAccess.object.typeText;
      return this.extractDiscriminantValuesFromTypeName(objectText);
    }
    if (
      propertyTypeDeclaration.union &&
      propertyTypeDeclaration.union.length > 0
    ) {
      const merged = propertyTypeDeclaration.union.flatMap((t) => {
        const v = this.tryExtractDiscriminantValuesFromIndexedAccess(t);
        return v ?? [];
      });
      return merged.length > 0 ? Array.from(new Set(merged)) : null;
    }
    return null;
  }

  private extractDiscriminantValuesFromTypeName(
    typeName: string,
  ): string[] | null {
    const root = this.lookupAliasOrInterfaceByName(typeName);
    if (!root) return null;

    const members: (
      | ts.TypeLiteralNode
      | ts.TypeAliasDeclaration
      | ts.InterfaceDeclaration
    )[] = [];

    if (Node.isTypeAliasDeclaration(root)) {
      const tn = root.getTypeNode();
      if (!tn) return null;

      if (tn.isKind(SyntaxKind.UnionType)) {
        for (const m of tn.getTypeNodes()) {
          if (m.isKind(SyntaxKind.TypeLiteral)) {
            members.push(m);
          } else if (m.isKind(SyntaxKind.TypeReference)) {
            const ref = this.resolveTypeReferenceNode(m);
            if (ref) members.push(ref);
          } else if (m.isKind(SyntaxKind.IntersectionType)) {
            m.getTypeNodes().forEach((t) => {
              if (t.isKind(SyntaxKind.TypeLiteral)) members.push(t);
              else if (t.isKind(SyntaxKind.TypeReference)) {
                const r2 = this.resolveTypeReferenceNode(t);
                if (r2) members.push(r2);
              }
            });
          }
        }
      } else if (
        tn.isKind(SyntaxKind.TypeLiteral) ||
        tn.isKind(SyntaxKind.IntersectionType)
      ) {
        members.push(root);
      }
    } else if (Node.isInterfaceDeclaration(root)) {
      members.push(root);
    }

    const out = new Set<string>();

    for (const m of members) {
      const props = Node.isTypeLiteral(m)
        ? m.getMembers().filter(Node.isPropertySignature)
        : this.collectFlattenedPropertySignatures(m);

      const typeProp = props.find((p) => p.getName() === 'type');
      if (!typeProp) continue;

      const tnode = typeProp.getTypeNode();
      if (!tnode) continue;

      const collectFromNode = (n: ts.TypeNode) => {
        if (n.isKind(SyntaxKind.LiteralType)) {
          const text = n.getText().replace(/['"]/g, '');
          if (text && text !== 'null' && text !== 'undefined') out.add(text);
        } else if (n.isKind(SyntaxKind.UnionType)) {
          n.getTypeNodes().forEach(collectFromNode);
        }
      };

      collectFromNode(tnode);
    }

    return out.size > 0 ? Array.from(out) : null;
  }
  isReferencePropertyByTypeDeclaration = (
    typeDecl: Omit<PropertyTypeDeclaration, 'hasQuestionMark'>,
  ): boolean => {
    return typeDecl.indexedAccess?.index.typeText.replace(/['"]/g, '') === 'id';
  };
}
