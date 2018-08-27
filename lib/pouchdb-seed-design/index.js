var objmap = require('object-map');
var objkeysmap = require('object-keys-map');
var deepEqual = require('deep-equal');

function normalizeDoc(doc, id) {

  function normalize(doc) {
    doc = Object.assign({}, doc);
    Object.keys(doc).forEach(function(prop) {
      if(!Array.isArray(doc[prop])) {
        var type = typeof doc[prop];
        if(type === 'object') {
          doc[prop] = normalize(doc[prop]);
        } else if(type === 'function') {
          doc[prop] = doc[prop].toString();
        }
      }
    });
    return doc;
  }

  var output = normalize(doc);
  output._id = id || doc._id;
  output._rev = doc._rev;
  return output;
}

function docEqual(local, remote) {
  if(!remote) return false;
  return deepEqual(local, remote, {strict: true});
}

module.exports = function (db, design, no_design) {
  if (!db || !design) {
    throw new TypeError('`db` and `design` are required');
  }

  function addDesign(s) {
    return no_design ? s : '_design/' + s;
  }

  var local = objmap(objkeysmap(design, addDesign), normalizeDoc);

  return db.allDocs({ include_docs: true, keys: Object.keys(local) })

    .then(function (docs) {

      var remote = {};

      docs.rows.forEach(function (doc) {
        if (doc.doc) {
          remote[doc.key] = doc.doc;
        }
      });

      var update = Object.keys(local).filter(function (key) {
        if(!remote[key]) return true;
        local[key]._rev = remote[key]._rev;
        return !docEqual(local[key], remote[key]);
      }).map(function (key) {
        return local[key];
      });

      if (update.length > 0) {
        return db.bulkDocs({ docs: update });
      } else {
        return Promise.resolve(false);
      }
    });

};
