'use strict';
/**
 * Created by vidit on 3/6/17.
 */
let utilities    = require('./utilities');
let mongo        = require('./mongo');
var socketIO     = require('./socket');

exports.createClass = createClass;

function createClass(req, res){
    let requiredFields = ["name"];
    if(!utilities.checkRequiredFields(req.body, requiredFields)){
        let response = {
            message : "Required Properties of classes missing"
        };
        return res.send(response);
    }
    console.info("Request = ", JSON.stringify(req.body));
    let body = req.body;
    let document = {
        name  : body.name,
        parent_id : body.parent_id || null,
        children : body.children || [],
        properties : body
    };

    delete body.name;
    delete body.parent_id;
    delete body.children;
    let classCollection = new  mongo.classes(document);
    classCollection.save().then((data)=>{
        let response = {
            message : "New Class created",
            body    : data
        };
        socketIO.emit("new_class",data);
        res.send(response)
    },(error)=>{

        let response = {
            message : error.message || "Error while creating new class"
        };
        res.send(response);
    });
}