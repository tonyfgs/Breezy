const swaggerUi = require('swagger-ui-express');

const swaggerUiOptions = {
  swaggerOptions: {
    urls: [
      { url: 'http://localhost:4001/api-docs/swagger.json', name: 'IAM' },
      { url: 'http://localhost:4002/api-docs/swagger.json', name: 'Users' },
      { url: 'http://localhost:4003/api-docs/swagger.json', name: 'Posts' },
      { url: 'http://localhost:4004/api-docs/swagger.json', name: 'Notifications' },
    ],
  },
};

module.exports = { swaggerUi, swaggerUiOptions };
