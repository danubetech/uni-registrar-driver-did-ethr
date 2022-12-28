'use strict';

import http from 'http';
import express from 'express';
import DidEthrController from './controllers/DidEthrController';
import DidPkhController from './controllers/DidPkhController';
import DidCheqdController from './controllers/DidCheqdController';

const serverPort = 9080;

const app = express();

app.use(express.json());

app.use((err: any, req: any, res: any, next: any) => {
    res.status(err.status || 500).json({
        message: err.message,
        errors: err.errors,
    });
});

app.post('/ethr/1.0/create', DidEthrController.create);
app.post('/ethr/1.0/update', DidEthrController.update);
app.post('/ethr/1.0/deactivate', DidEthrController.deactivate);
app.post('/pkh/1.0/create', DidPkhController.create);
app.post('/pkh/1.0/update', DidPkhController.update);
app.post('/pkh/1.0/deactivate', DidPkhController.deactivate);
app.post('/cheqd/1.0/create', DidCheqdController.create);
app.post('/cheqd/1.0/update', DidCheqdController.update);
app.post('/cheqd/1.0/deactivate', DidCheqdController.deactivate);

http.createServer(app).listen(serverPort, function () {
    console.log('Your server is listening on port %d (http://localhost:%d)', serverPort, serverPort);
    console.log('Swagger-ui is available on http://localhost:%d/docs', serverPort);
});
