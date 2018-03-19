// @flow

export const env: string = process.env.NODE_ENV || 'development';
export const isEnv = (e: string) => e === env;
