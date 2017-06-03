"use strict";
/**
 * Created by vidit on 3/6/17.
 */
exports.checkRequiredFields = checkRequiredFields;

function checkRequiredFields(body, requiredFields){
    for(let i=0; i < requiredFields.length; i ++){
        let value = body[requiredFields[i]];
        if(value == undefined || value==null){
            return false
        }
    }
    return  true;
}