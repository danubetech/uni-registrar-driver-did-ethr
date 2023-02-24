'use strict';

import writer from '../utils/writer.js';
import DefaultService from '../service/DefaultService.js';

// see https://github.com/UCRegistry/chain-registry/tree/master/chains
export default {
    create: function(req: any, res: any) {
        DefaultService.create(req.body, 'did:pkh')
            .then(function (response) {
                writer.writeJson(res, response);
            })
            .catch(function (response) {
                writer.writeJson(res, response);
            });
    },

    update: function(req: any, res: any) {
        DefaultService.update(req.body, 'did:pkh')
            .then(function (response) {
                writer.writeJson(res, response);
            })
            .catch(function (response) {
                writer.writeJson(res, response);
            });
    },

    deactivate: function(req: any, res: any) {
        DefaultService.deactivate(req.body, 'did:pkh')
            .then(function (response) {
                writer.writeJson(res, response);
            })
            .catch(function (response) {
                writer.writeJson(res, response);
            });
    }
}