import type { IJsonQuery } from './query';

interface ICreate<TEntity> {
  fields: Partial<TEntity>;
  query?: IJsonQuery<TEntity>;
}

interface IList<TEntity> {
  list: TEntity[];
  count?: number;
}

interface IView<TEntity> {
  entity: TEntity;
}

interface IUpdate<TEntity> {
  fields: Partial<TEntity>;
  query?: IJsonQuery<TEntity>;
}

interface IRemove<TEntity> {
  deleted: Partial<TEntity>[];
  entities?: TEntity[];
}

interface IRestore<TEntity> {
  restored: TEntity[];
}

interface ICount {
  count: number;
}

export type {
  ICreate,
  IList,
  IView,
  IUpdate,
  IRemove,
  IRestore,
  ICount,
};
