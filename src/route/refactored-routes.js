'use strict';

const logger = require('../lib/logger');
const Note = require('../model/note');
const storage = require('../lib/storage');
const response = require('../lib/response');

module.exports = function routeNote(router) {
  router.post('/api/v1/note', (req, res) => {
    logger.log(logger.INFO, 'NOTE-ROUTE: POST /api/v1/note');

    try {
      const newNote = new Note(req.body.title, req.body.content);
      storage.create('Note', newNote)
        .then((note) => {
          response.sendJSON(res, 201, note);
          return undefined;
        });
    } catch (err) {
      logger.log(logger.ERROR, `NOTE-ROUTE: There was a bad request ${err}`);
      response.sendText(res, 400, err.message);
      return undefined;
    }
    return undefined;
  });
  router.get('/api/v1/note', (req, res) => {
    if (req.url.query.id) {
      storage.fetchOne('Note', req.url.query.id)
        .then((item) => {
          response.sendJSON(res, 200, item);
        })
        .catch((err) => {
          logger.log(logger.ERROR, err, JSON.stringify(err));

          response.sendText(res, 404, err.message);
        });
    } else {
      storage.fetchAll('Note')
        .then((item) => {
          response.sendJSON(res, 200, item);
        })
        .catch((err) => {
          logger.log(logger.ERROR, err, JSON.stringify(err));
          response.sendText(res, 404, err.message);
        });
    }
  });
  router.delete('/api/v1/note', (req, res) => {
    storage.delete('Note', req.url.query.id)
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
