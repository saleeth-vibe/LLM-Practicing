import { app } from './app';
import { env } from './config/env';
import { sequelize } from './config/database';

async function start() {
  await sequelize.authenticate();
  app.listen(env.port, () => {
    console.log(`Campus API listening on http://localhost:${env.port}`);
  });
}

start().catch((error) => {
  console.error('Failed to start server', error);
  process.exit(1);
});
