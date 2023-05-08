'use strict';

import writer from '../utils/writer.js';
import EthrService from '../service/EthrService.js';

export default {
    create: function(req: any, res: any) {
        EthrService.create(req.body, 'did:ethr')
            .then(function (response) {
                writer.writeJson(res, response);
            })
            .catch(function (response) {
                writer.writeJson(res, response);
            });
    },

    update: function(req: any, res: any) {
        EthrService.update(req.body, 'did:ethr')
            .then(function (response) {
                writer.writeJson(res, response);
            })
            .catch(function (response) {
                writer.writeJson(res, response);
            });
    },

    deactivate: function(req: any, res: any) {
        EthrService.deactivate(req.body, 'did:ethr')
            .then(function (response) {
                writer.writeJson(res, response);
            })
            .catch(function (response) {
                writer.writeJson(res, response);
            });
    }
}