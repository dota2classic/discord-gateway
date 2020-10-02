export const DISCORD_SERVER_ID = () => process.env.DISCORD_SERVER_ID;
export const DISCORD_API_TOKEN = () => process.env.DISCORD_API_TOKEN;

export const profile = process.env.PROFILE;
export const isProd = profile === 'prod';
export const isDev = !isProd;