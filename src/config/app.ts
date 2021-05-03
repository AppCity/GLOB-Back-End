export const {
    NODE_ENV = 'development',
    APP_PORT = process.env.PORT ? process.env.PORT : 3000,
} = process.env

export const IN_PROD = NODE_ENV === 'production'