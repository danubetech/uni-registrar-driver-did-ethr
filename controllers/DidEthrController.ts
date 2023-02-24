'use strict';

import writer from '../utils/writer.js';
import DefaultService from '../service/DefaultService.js';

export default {
    create: function(req: any, res: any) {
        DefaultService.create(req.body, 'did:ethr')
            .then(function (response) {
                writer.writeJson(res, response);
            })
            .catch(function (response) {
                writer.writeJson(res, response);
            });
    },

    update: function(req: any, res: any) {
        DefaultService.update(req.body, 'did:ethr')
            .then(function (response) {
                writer.writeJson(res, response);
            })
            .catch(function (response) {
                writer.writeJson(res, response);
            });
    },

    deactivate: function(req: any, res: any) {
        DefaultService.deactivate(req.body, 'did:ethr')
            .then(function (response) {
                writer.writeJson(res, response);
            })
            .catch(function (response) {
                writer.writeJson(res, response);
            });
    }
}