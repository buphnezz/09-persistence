'use strict';

const logger = require('../lib/logger');
const Dinosaur = require('../model/dinosaur');
const storage = require('../lib/storage');
const response = require('../lib/response');

module.exports = function routeDinosaur(router) {
  router.post('/api/v1/dinosaur', (req, res) => {
    logger.log(logger.INFO, 'DINOSAUR-ROUTE: POST /api/v1/dinosaur');

    try {
      const newDinosaur = new Dinosaur(req.body.title, req.body.content);
      storage.create('Dinosaur', newDinosaur)
        .then((dinosaur) => {
          response.sendJSON(res, 201, dinosaur);
          return undefined;
        });
    } catch (err) {
      logger.log(logger.ERROR, `DINOSAUR-ROUTE: There was a bad request ${err}`);
      response.sendText(res, 400, err.message);
      return undefined;
    }
    return undefined;
  });
  router.get('/api/v1/dinosaur', (req, res) => {
    if (req.url.query.id) {
      storage.fetchOne('Dinosaur', req.url.query.id)
        .then((item) => {
          response.sendJSON(res, 200, item);
        })
        .catch((err) => {
          logger.log(logger.ERROR, err, JSON.stringify(err));

          response.sendText(res, 404, err.message);
        });
    } else {
      storage.fetchAll('Dinosaur')
        .then((item) => {
          response.sendJSON(res, 200, item);
        })
        .catch((err) => {
          logger.log(logger.ERROR, err, JSON.stringify(err));
          response.sendText(res, 404, err.message);
        });
    }
  });
  router.delete('/api/v1/dinosaur', (req, res) => {
    storage.delete('Dinosaur', req.url.query.id)
      .then(() => {
        response.sendText(res, 204, 'No content in the body');
        return undefined;
      })
      .catch((err) => {
        logger.log(logger.ERROR, err, JSON.stringify(err));
        response.sendText(res, 404, 'Resource not found');
        return undefined;
      });
    return undefined;
  });
};
