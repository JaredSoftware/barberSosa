export default () => ({
  port: parseInt(process.env.PORT ?? '4000', 10),
  mongodbUri: process.env.MONGODB_URI ?? 'mongodb://localhost:27018/sosabarber',
  jwt: {
    secret: process.env.JWT_SECRET ?? 'change-me-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID ?? '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    callbackUrl:
      process.env.GOOGLE_CALLBACK_URL ??
      'http://localhost:4000/api/auth/google/callback',
  },
  frontendUrls: (process.env.FRONTEND_URLS ?? 'http://localhost:3000,http://localhost:3001').split(','),

  // Mercado Pago (credenciales en https://www.mercadopago.com/developers/panel/app)
  mercadopago: {
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN ?? '',
    successUrl: process.env.MERCADOPAGO_SUCCESS_URL ?? 'http://localhost:3000/cart?payment=success',
    failureUrl: process.env.MERCADOPAGO_FAILURE_URL ?? 'http://localhost:3000/cart?payment=failure',
    pendingUrl: process.env.MERCADOPAGO_PENDING_URL ?? 'http://localhost:3000/cart?payment=pending',
    webhookUrl: process.env.MERCADOPAGO_WEBHOOK_URL ?? '',
  },
});
