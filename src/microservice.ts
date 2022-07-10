/**
 * JSON RPC microservice error structure
 */
interface IBaseException {
  code: number;
  status: number;
  service: string;
  message: string;
  rawMessage?: string;
  payload?: Record<string, any> | IValidationErrorFields[];
}

/**
 * JSON RPC response structure
 */
interface IMicroserviceResponse<TResult = Record<string, any>> {
  id?: string;
  result?: TResult;
  error?: IBaseException;
}

interface IValidationErrorFields {
  value: string | number | boolean | null;
  property: string;
  constraints: Record<string, string>;
}

export type { IBaseException, IMicroserviceResponse, IValidationErrorFields };
