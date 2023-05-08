'use strict';

import writer from '../utils/writer.js';
import CheqdService from "../service/CheqdService.js";

export default {
    create: function(req: any, res: any) {
        CheqdService.create(req.body, 'did:cheqd')
            .then(function (response) {
                writer.writeJson(res, response);
            })
            .catch(function (response) {
                writer.writeJson(res, response);
            });
    },

    update: function(req: any, res: any) {
        CheqdService.update(req.body, 'did:cheqd')
            .then(function (response) {
                writer.writeJson(res, response);
            })
            .catch(function (response) {
                writer.writeJson(res, response);
            });
    },

    deactivate: function(req: any, res: any) {
        CheqdService.deactivate(req.body, 'did:cheqd')
            .then(function (response) {
                writer.writeJson(res, response);
            })
            .catch(function (response) {
                writer.writeJson(res, response);
            });
    }
}