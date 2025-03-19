export interface IDatabaseConfig {
  database: string;
  dialect: string;
  host: string;
  username: string;
  password: string;
  port: number;
}

export interface IMailUser {
  mail: string;
  password: string;
}

export interface IMailConfig {
  port: number;
  host: string;
}
