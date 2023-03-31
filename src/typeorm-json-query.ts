interface ITypeormRelationOptions {
  name: string;
  isSelect?: boolean;
  isLateral?: boolean;
  isDisabled?: boolean;
}

interface ITypeormJsonQueryOptions {
  defaultPageSize: number;
  maxPageSize: number;
  maxRelations: number;
  maxDeepRelation: number;
  maxDeepWhere: number;
  defaultRelationPageSize: number;
  defaultRelationMaxPageSize: number;
  /**
   *  E.g.: ['*'] - disable select relations (only join) or ['relation', { name: 'some-relation', isSelect: false, isLateral: true }]
   *  NOTE: by default DISABLE select provided relations
   *  isDisable - disable relation for client side
   */
  relationOptions?: (ITypeormRelationOptions | string)[];
  isDisableRelations?: boolean;
  isDisableAttributes?: boolean;
  isDisableOrderBy?: boolean;
  isDisableGroupBy?: boolean;
  isDisablePagination?: boolean;
  isLateralJoins?: boolean;
}

export type { ITypeormJsonQueryOptions, ITypeormRelationOptions }
