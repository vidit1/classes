'use strict';
/**
 * Created by vidit on 3/6/17.
 */

let Promise      = require('bluebird');
let ObjectId     = require('mongoose').Types.ObjectId;
let mongo        = require('./mongo');
var socketIO     = require('./socket');
let utilities    = require('./utilities');

exports.createClass = createClass;
exports.getAll      = getAll;
exports.deleteClass = deleteClass;
exports.updateClass = updateClass;


function createClass(req, res){
    let requiredFields = ["name","properties"];
    if(!utilities.checkRequiredFields(req.body, requiredFields)){
        let response = {
            message : "Required Properties of classes missing"
        };
        return res.send(response);
    }
    console.info("Request = ", JSON.stringify(req.body));
    
    Promise.coroutine(function *() {
        let body = req.body;
        let document = {
            name  : body.name,
            parent_id : body.parent_id || null,
            children : body.children || [],
            properties : body.properties
        };

        let classCollection = new  mongo.classes(document);
        let newClass = yield classCollection.save();
        socketIO.emit("new_class",newClass);
        newClass     = newClass._doc;
        if(document.parent_id) {
            let id = newClass._id.toString();
            yield  mongo.classes.update( {_id  : ObjectId(document.parent_id)}, {"$push": {"children": id}});
            let parent = yield mongo.classes.find({_id:document.parent_id });
            socketIO.emit("update_class",parent[0]);
        }
        return newClass
    })().then((data)=> {
        let response = {
            message : "New Class created",
            class    : data
        };

        res.send(response);
    }, (error)=> {
        let response = {
            error : error.message || "Error while creating new class"
        };
        res.send(response);
    });
    
}

function getAll(req,res){
    mongo.classes.find({}).then((result)=>{
        let response = {
            message :"All classes info",
            list    : result
        };
        res.send(response)
    },(error)=>{
        let response = {
            error : error.message || "Error while fetching all classes"
        };
        res.send(response);
    })
}

function deleteClass(req,res){
    if(!req.body.hasOwnProperty("_id")){
        let response = {
            message : "Class id missing"
        };
        return res.send(response);
    }
    Promise.coroutine(function *() {
        let id = req.body._id;
        let classInfo = yield mongo.classes.find({_id : id});
        classInfo     = classInfo[0]._doc;
        if(classInfo.children.length ){
            throw new Error("Class with children cannot be deleted")
        }
        yield mongo.classes.findByIdAndRemove(id);
        if(classInfo.parent_id){
            yield mongo.classes.update({_id: classInfo.parent_id},{$pull : {children:id}});
            let parent = yield mongo.classes.find({_id:classInfo.parent_id });
            socketIO.emit("update_class",parent[0]);
        }
        socketIO.emit("delete_class",id);
    })().then(()=> {
        let response = {
            message :"Class successfully deleted"
        };
        res.send(response);
    }, (error)=> {
        let response = {
            error : error.message || "Error while deleting class"
        };
        res.send(response);
    })
}

function updateClass(req, res){
    let requiredFields = ["id","properties"];
    if(!utilities.checkRequiredFields(req.body, requiredFields)){
        let response = {
            error : "Required Properties of classes missing"
        };
        return res.send(response);
    }

    let id = req.body.id;
    let properties = req.body.properties;
    Promise.coroutine(function *() {
        yield mongo.classes.update({_id : id},{$set : {properties:properties}});
        let classInfo = yield mongo.classes.find({_id : id});
        socketIO.emit("update_class",classInfo[0]._doc);
    })().then(()=> {
        let response = {
            message :"Class successfully updated"
        };
        res.send(response);
    }, (error)=> {
        let response = {
            error : error.message || "Error while updating class properties"
        };
        res.send(response);
    })
}