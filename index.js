'use strict';

import http from 'http';
import express from 'express';
import controllers from './controllers/Default.js';

const serverPort = 9080;

const app = express();

app.use(express.json());

app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
    });
});

app.post('/1.0/create', controllers.create);
app.post('/1.0/update', controllers.update);
app.post('/1.0/deactivate', controllers.deactivate);

http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});
