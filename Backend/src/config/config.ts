const _config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseURL: process.env.DATABASE_URL || 'mongodb://localhost:27017/airbnb',
};

export const config = {
  get(key: keyof typeof _config) {
    const value = _config[key];

    if (!value) {
      console.error(
        `The ${key} variable not found. Make sure to pass environment variables.`
      );

      process.exit();
    }

    return value;
  },
};
