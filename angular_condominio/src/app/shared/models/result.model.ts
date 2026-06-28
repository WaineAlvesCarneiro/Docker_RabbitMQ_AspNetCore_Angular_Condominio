export interface Result<T> {
  sucesso: boolean;
  dados: T;
  erro?: string;
}