const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { swaggerUi, swaggerUiOptions } = require('./swagger');
const { createProxy } = require('./proxy');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, swaggerUiOptions));

app.use('/api/iam', createProxy(process.env.IAM_URL || 'http://localhost:4001'));
app.use('/api/users', createProxy(process.env.USERS_URL || 'http://localhost:4002'));
app.use('/api/posts', createProxy(process.env.POSTS_URL || 'http://localhost:4003'));
app.use('/api/notifications', createProxy(process.env.NOTIFICATIONS_URL || 'http://localhost:4004'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

module.exports = app;
