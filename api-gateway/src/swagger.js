const swaggerJsdoc = require('swagger-jsdoc');

module.exports = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: { title: 'API Gateway', version: '1.0.0', description: 'Breezy API Gateway' },
    servers: [{ url: `http://localhost:${process.env.PORT || 4000}` }],
  },
  apis: ['./src/app.js'],
});
