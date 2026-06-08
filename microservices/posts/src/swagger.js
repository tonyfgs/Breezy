const swaggerJsdoc = require('swagger-jsdoc');

module.exports = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Posts Service',
      version: '1.0.0',
      description: 'Posts and content',
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 4003}` }],
  },
  apis: ['./src/routes/*.js'],
});
