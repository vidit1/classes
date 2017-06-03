/**
 * Created by vidit on 3/6/17.
 */
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect('mongodb://root:Hello1haha@ds163181.mlab.com:63181/heroku_kcgn0699');

var Schema = mongoose.Schema;


var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("MongoDb connection established");
});

let classSchema = new Schema({
   name : {type : "string", required: true},
   parent_id : {type : "number", required: false},
   children : {type : "Array", required: true},
    properties:{type:"object"}
}, {
    versionKey: false
});
module.exports.classes = mongoose.model('classes', classSchema);
