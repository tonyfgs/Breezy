window.onload = function () {
  SwaggerUIBundle({
    urls: [
      { url: '/api-specs/iam', name: 'IAM' },
      { url: '/api-specs/users', name: 'Users' },
      { url: '/api-specs/posts', name: 'Posts' },
      { url: '/api-specs/notifications', name: 'Notifications' },
    ],
    'urls.primaryName': 'IAM',
    dom_id: '#swagger-ui',
    deepLinking: true,
    presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
    plugins: [SwaggerUIBundle.plugins.DownloadUrl],
    layout: 'StandaloneLayout',
  });
};
