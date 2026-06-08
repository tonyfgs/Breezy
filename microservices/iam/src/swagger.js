const swaggerJsdoc = require('swagger-jsdoc');

module.exports = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'IAM Service',
      version: '1.0.0',
      description: 'Identity and Access Management',
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 4001}` }],
  },
  apis: ['./src/routes/*.js'],
});
