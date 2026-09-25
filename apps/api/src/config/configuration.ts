export interface AppConfig {
  port: number;
  jwtSecret: string;
  jwtExpiresIn: string;
  clientUrl: string;
  databaseUrl: string;
}

export function configuration(): { app: AppConfig } {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error(
      'JWT_SECRET is not set. Refusing to start with an insecure default.'
    );
  }

  return {
    app: {
      port: parseInt(process.env.PORT || '4000', 10),
      jwtSecret,
      jwtExpiresIn: '7d',
      clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
      databaseUrl: process.env.DATABASE_URL || '',
    },
  };
}
