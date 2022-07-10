/**
 * Extends entity interface from this interface
 */
interface IEntity {
  isEntity?: never;
}

/**
 * Extends entity class from this class
 */
class CEntity implements IEntity {
  isEntity?: never;
}

enum JQOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

enum JQOrderNulls {
  first = 'first',
  last = 'last',
}

enum JQFieldType {
  text = 'text',
}

enum JQOperator {
  between = 'between',
  like = 'like',
  in = 'in',
  notIn = '!in',
  notEqual = '!=',
  equal = '=',
  greater = '>',
  greaterOrEqual = '>=',
  less = '<',
  lessOrEqual = '<=',
}

enum JQJunction {
  and = 'and',
  or = 'or',
}

export type ObjectLiteral = Record<string | symbol | number, any>;

export type ToObject<T> = NonNullable<T extends readonly any[] ? T[0] : T>;

export type Without<T, TU> = {
  [P in Exclude<keyof T, keyof TU>]?: never;
};

export type XOR<T, TU> = T | TU extends Record<string, any>
  ? (Without<T, TU> & TU) | (Without<TU, T> & T)
  : T | TU;

export type CurryXOR<T, TR extends unknown[]> = {
  0: [T];
  1: TR extends readonly [infer U, ...infer V] ? [...CurryXOR<XOR<T, U>, V>] : never;
}[TR extends readonly [infer _, ...infer __] ? 1 : 0];

export type XOR_MULTIPLE<TR extends unknown[]> = {
  0: TR extends readonly [infer U] ? U : never;
  1: TR extends readonly [infer U, ...infer V] ? CurryXOR<U, V>[0] : never;
}[TR extends readonly [infer _, ...infer __] ? 1 : 0];

type TNonEmptyArray<T> = [T, ...T[]];

type TFilterValue = string | number | null;

type TFilterOptions = { type?: JQFieldType };

type TFilterLess = { [JQOperator.less]: TFilterValue } & TFilterOptions;

type TFilterLessOrEqual = { [JQOperator.lessOrEqual]: TFilterValue } & TFilterOptions;

type TFilterGreater = { [JQOperator.greater]: TFilterValue } & TFilterOptions;

type TFilterGreaterOrEqual = {
  [JQOperator.greaterOrEqual]: TFilterValue;
} & TFilterOptions;

type TFilterCondition = XOR_MULTIPLE<[
    {
      [JQOperator.equal]: TFilterValue;
    } & TFilterOptions,
    {
      [JQOperator.notEqual]: TFilterValue;
    } & TFilterOptions,
    {
      [JQOperator.between]: [TFilterValue, TFilterValue];
      isIncludes?: boolean;
    } & TFilterOptions,
    {
      [JQOperator.like]: string;
      insensitive?: boolean;
    } & TFilterOptions,
    {
      [JQOperator.in]: TNonEmptyArray<TFilterValue>;
    } & TFilterOptions,
    {
      [JQOperator.notIn]: TNonEmptyArray<TFilterValue>;
    } & TFilterOptions,
  XOR_MULTIPLE<[
    TFilterLess,
    TFilterLessOrEqual,
    TFilterGreater,
    TFilterGreaterOrEqual,
      XOR<TFilterLess, TFilterLessOrEqual> & XOR<TFilterGreater, TFilterGreaterOrEqual>,
  ]>,
]>;

type TWithRelationFields<TE extends ObjectLiteral,
  TP extends string | number | symbol,
  TExistKeys = {},
  > = ToObject<TE[TP]> extends IEntity
  ? TExistKeys extends { [key in TP]: any } // avoid infinite recursion
    ? never
    : keyof {
      // @ts-ignore
      [PF in keyof Omit<ToObject<TE[TP]>, keyof IEntity> as `${TP}.${TWithRelationFields<ToObject<TE[TP]>,
        PF,
        { [key in TP | keyof TExistKeys]: any }>}`]: string;
    } // return relation fields
  : TP; // or return entity field

type TWithRelations<TE extends ObjectLiteral,
  TP extends string | number | symbol,
  TExistKeys = {},
  > = ToObject<TE[TP]> extends IEntity
  ? TExistKeys extends { [key in TP]: any } // avoid infinite recursion
    ? never
    : keyof {
      [PF in keyof ToObject<TE[TP]> as // @ts-ignore
        | `${TP}.${TWithRelations<ToObject<TE[TP]>, PF, { [key in TP | keyof TExistKeys]: any }>}`
        | TP]: any;
    }
  : never;

type TEntityRelations<TEntity> = keyof {
  [P in keyof TEntity as TWithRelations<TEntity, P>]: any;
};

// Get entity keys and keys with relations
type TEntityFields<TEntity> = keyof Omit<{
  [P in keyof TEntity as TWithRelationFields<TEntity, P>]: any;
},
  keyof IEntity>;

type TFieldCondition = string | number | null | TFilterCondition;

type TFilterFields<TEntity = ObjectLiteral> = {
  [field in TEntityFields<TEntity>]?: TFieldCondition;
};

type IJsonQueryWhere<TEntity = ObjectLiteral> =
  | {
  [JQJunction.and]?: TNonEmptyArray<IJsonQueryWhere<TEntity>>;
  [JQJunction.or]?: TNonEmptyArray<IJsonQueryWhere<TEntity>>;
}
  | TFilterFields<TEntity>;

type IJsonQueryOrderField = {
  order: keyof typeof JQOrder;
  nulls?: keyof typeof JQOrderNulls;
};

interface IJsonQueryRelation<TEntity = ObjectLiteral, TN = TEntityRelations<TEntity>> {
  name: TN;
  // @ts-ignore
  where?: IJsonQueryWhere<TEntity[TN]>;
}

interface IJsonQuery<TEntity = ObjectLiteral> {
  attributes?: TEntityFields<TEntity>[];
  relations?: (TEntityRelations<TEntity> | IJsonQueryRelation<TEntity>)[];
  where?: IJsonQueryWhere<TEntity>;
  orderBy?: {
    [field in TEntityFields<TEntity>]?: keyof typeof JQOrder | IJsonQueryOrderField;
  };
  groupBy?: TEntityFields<TEntity>[];
  page?: number;
  pageSize?: number;
}

interface IQuery<TEntity = ObjectLiteral> {
  query?: IJsonQuery<TEntity>;
}

export type {
  IEntity,
  IQuery,
  IJsonQuery,
  IJsonQueryOrderField,
  IJsonQueryWhere,
  IJsonQueryRelation,
  TEntityFields,
  TFilterFields,
  TFieldCondition,
  TEntityRelations,
  TFilterCondition,
  TWithRelations,
  TWithRelationFields,
  TFilterGreaterOrEqual,
  TFilterGreater,
  TFilterLessOrEqual,
  TFilterLess,
  TFilterOptions,
  TFilterValue,
  TNonEmptyArray,
}

export {
  CEntity,
  JQOrder,
  JQOrderNulls,
  JQFieldType,
  JQOperator,
  JQJunction,
}
