var Db = require('mongodb').Db,
    Connection = require('mongodb').Connection,
    Server = require('mongodb').Server;

var Mongo = exports.Mongo = function(host, port, dbname){
    this.host = host != null ? host : 'localhost';
    this.port = port != null ? port : 27017;
    this.dbname = dbname;
    this.database = new Db(dbname, new Server(this.host, this.port, {}), {});
};

Mongo.prototype.collection = function(name, callback) {
    this.database.open(function(err, db) {
        db.collection(name, function(err, collection) {
            if('function' === typeof callback) callback(err, collection);
        });
    });
};

Mongo.prototype.insert = function(collname, docs, callback) {
    this.database.open(function(err, db) {
        db.collection(collname, function(err, collection) {
            collection.insert(docs, function(err, count){
                db.close();
                if('function' === typeof callback) callback(err, count);              
            });
        });
    });
};