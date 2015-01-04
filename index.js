var Joi = require('joi');
var Boom = require('boom');

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
      copyToObject(req, validated);

      return next();
    }
  }
};

/**
 * Copy the keys in the source object to the destination
 *
 * @param  {Object} dest The destination object to update
 * @param  {Object} src  The source object to copy
 * @return {Object}      The updated destination object
 */

/* istanbul ignore next */
function copyToObject(dest, src) {
  if (src) {
    for (var key in src) {
      if (src.hasOwnProperty(key)) {
        dest[key] = src[key];
      }
    }
  }

  return dest;
}