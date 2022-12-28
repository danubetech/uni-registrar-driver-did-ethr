'use strict';

import write from '../utils/writer.js';
import DefaultService from '../service/DefaultService.js';

export default {
    create: function (req, res) {
        DefaultService.create(req.body)
            .then(function (response) {
                writer.writeJson(res, response);
            })
            .catch(function (response) {
                writer.writeJson(res, response);
            });
    },

    update: function(req, res) {
        DefaultService.update(req.body)
            .then(function (response) {
                writer.writeJson(res, response);
            })
            .catch(function (response) {
                writer.writeJson(res, response);
            });
    },

    deactivate: function(req, res) {
        DefaultService.deactivate(req.body)
            .then(function (response) {
                writer.writeJson(res, response);
            })
            .catch(function (response) {
                writer.writeJson(res, response);
            });
    }
}