export interface DatabaseResult {
  lastInsertRowid: number | bigint;
  changes: number;
}

export interface QueryResult<T> {
  [key: string]: T | undefined;
}

export interface Lock {
  timestamp: number;
  operation: string;
}

export interface DbResult<T> {
  success: boolean;
}