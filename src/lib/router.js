'use strict';

const logger = require('./logger');
const bodyParser = require('./body-parser');
const urlParser = require('./url-parser');
const response = require('../lib/response');

const Router = module.exports = function router() {
  this.routes = {
    GET: {},
    POST: {},
    PUT: {},
    DELETE: {},
  };
};

Router.prototype.get = function get(endpoint, callback) {
  this.routes.GET[endpoint] = callback;
};

Router.prototype.post = function post(endpoint, callback) {
  this.routes.POST[endpoint] = callback;
};

Router.prototype.put = function put(endpoint, callback) {
  this.routes.PUT[endpoint] = callback;
};

Router.prototype.delete = function del(endpoint, callback) {
  this.routes.DELETE[endpoint] = callback;
};

Router.prototype.route = function route() {
  return (req, res) => {
    Promise.all([
      urlParser(req),
      bodyParser(req),
    ])
      .then(() => {
        if (typeof this.routes[req.method][req.url.pathname] === 'function') {
          this.routes[req.method][req.url.pathname](req, res);
          return;
        }

        response.sendText(res, 404, 'Route Not Found FROM HERE');
        // res.writeHead(404, { 'Content-Type': 'text/plain' });
        // res.write('Route Not Found FROM HERE');
        // res.end();
      })
      .catch((err) => {
        if (err instanceof SyntaxError) {
          response.sendText(res, 404, 'Route Not Found');
          // res.writeHead(404, { 'Content-Type': 'text/plain' });
          // res.write('Route Not Found');
          // res.end();
          return undefined;
        }
        logger.log(logger.ERROR, JSON.stringify(err));
        response.sendText(res, 400, 'Bad Request');
        // res.writeHead(400, { 'Content-Type': 'text/plain' });
        // res.write('Bad Request');
        // res.end();
        return undefined;
      });
  };
};
