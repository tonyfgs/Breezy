const swaggerJsdoc = require('swagger-jsdoc');

module.exports = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Users Service',
      version: '1.0.0',
      description: 'User profiles',
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 4002}` }],
  },
  apis: ['./src/routes/*.js'],
});
