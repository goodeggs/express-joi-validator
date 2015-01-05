var Joi = require('joi');
var Boom = require('boom');
var Extend = require('extend');

module.exports = function validate(schema, options) {
  options = options || {};

  return function validateRequest(req, res, next) {
    var toValidate = {};
    /* istanbul ignore if */
    if (!schema) {
      return next();
    }

    if (schema.params) {
      toValidate.params = req.params;
    }

    if (schema.body) {
      toValidate.body = req.body;
    }

    if (schema.query) {
      toValidate.query = req.query;
    }

    return Joi.validate(toValidate, schema, options, onValidationComplete);

    function onValidationComplete(err, validated) {
      if (err) {
        return next(Boom.badRequest(err.message, err.details));
      }

      // copy the validated data to the req object
      Extend(req, validated);

      return next();
    }
  }
};