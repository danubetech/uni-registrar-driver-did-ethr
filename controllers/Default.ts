'use strict';

import writer from '../utils/writer';
import DefaultService from '../service/DefaultService';

export default {
    create: function(req: any, res: any) {
        DefaultService.create(req.body)
            .then(function (response) {
                writer.writeJson(res, response);
            })
            .catch(function (response) {
                writer.writeJson(res, response);
            });
    },

    update: function(req: any, res: any) {
        DefaultService.update(req.body)
            .then(function (response) {
                writer.writeJson(res, response);
            })
            .catch(function (response) {
                writer.writeJson(res, response);
            });
    },

    deactivate: function(req: any, res: any) {
        DefaultService.deactivate(req.body)
            .then(function (response) {
                writer.writeJson(res, response);
            })
            .catch(function (response) {
                writer.writeJson(res, response);
            });
    }
}