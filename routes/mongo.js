/**
 * Created by vidit on 3/6/17.
 */
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

var connect = function() {
    mongoose.connect('mongodb://root:Hello1haha@ds163181.mlab.com:63181/heroku_kcgn0699', {server: { auto_reconnect: true }});
};
connect();

var Schema = mongoose.Schema;
var isConnectedBefore = false;
var db = mongoose.connection;


db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {
    isConnectedBefore = true;
    console.log("MongoDb connection established");
});

db.on('disconnected', function(){
    console.log('Lost MongoDB connection...');
    if (!isConnectedBefore) {
        setTimeout(function(){
            "use strict";
            connect();

        },5000);
    }
});

let classSchema = new Schema({
    name : {type : "string", required: true},
    parent_id : {type : "ObjectId", required: false},
    children : [],
    properties:{type:"object"}
}, {
    versionKey: false
});
module.exports.classes = mongoose.model('classes', classSchema);
