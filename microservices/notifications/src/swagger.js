const swaggerJsdoc = require('swagger-jsdoc');

module.exports = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notifications Service',
      version: '1.0.0',
      description: 'Notifications',
    },
    servers: [{ url: `http://localhost:${process.env.PORT || 4004}` }],
  },
  apis: ['./src/routes/*.js'],
});
