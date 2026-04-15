import express from 'express';
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@as-integrations/express4';
import { initializeDatabase } from './database/init';
import alchemistRoutes from './api/alchemists';
import { typeDefs, resolvers } from './api/potions';

const PORT = process.env.PORT || 4000;

async function startServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  // Initialize database
  await initializeDatabase();
  console.log('🧪 Database is ready');

  // Health check
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', message: '🧙 The brewery is bubbling!' });
  });

  // REST API routes
  app.use('/api', alchemistRoutes);
  console.log('⚗️  REST API routes mounted at /api');

  // GraphQL setup
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();
  console.log('🔮 Apollo Server started');

  app.use(
    '/graphql',
    expressMiddleware(apolloServer)
  );

  // Start listening
  app.listen(PORT, () => {
    console.log('');
    console.log('🧪✨ Potion Brewery Backend is running! ✨🧪');
    console.log(`⚗️  REST API:  http://localhost:${PORT}/api`);
    console.log(`🔮 GraphQL:   http://localhost:${PORT}/graphql`);
    console.log(`💚 Health:    http://localhost:${PORT}/health`);
    console.log('');
  });
}

startServer().catch((err) => {
  console.error('💥 Failed to start the Potion Brewery:', err);
  process.exit(1);
});
