'use strict';

import writer from '../utils/writer.js';
import PkhService from "../service/PkhService.js";

// see https://github.com/UCRegistry/chain-registry/tree/master/chains
export default {
    create: function(req: any, res: any) {
        PkhService.create(req.body, 'did:pkh')
            .then(function (response) {
                writer.writeJson(res, response);
            })
            .catch(function (response) {
                writer.writeJson(res, response);
            });
    },

    update: function(req: any, res: any) {
        PkhService.update(req.body, 'did:pkh')
            .then(function (response) {
                writer.writeJson(res, response);
            })
            .catch(function (response) {
                writer.writeJson(res, response);
            });
    },

    deactivate: function(req: any, res: any) {
        PkhService.deactivate(req.body, 'did:pkh')
            .then(function (response) {
                writer.writeJson(res, response);
            })
            .catch(function (response) {
                writer.writeJson(res, response);
            });
    }
}