//Imports
const fileSystem = require('fs');

const Sauce = require('../models/sauce');
const errorFunctions = require('../common/errors');
const successFunctions = require('../common/successes');

//Exports
exports.getAllSauces = (request, response, next) => {
    //Getting informations about all of the sauces
    Sauce.find()
        .then(sauceList => response.status(200).json(sauceList))
        .catch(error => errorFunctions.sendServerError(response, error));
};



exports.getOneSauce = (request, response, next) => {
    //Getting informations about the specified sauce
    Sauce.findOne({ _id : request.params.id })
        .then(sauceAsked => {
            if(sauceAsked===null){
                //Sauce provided does not exists : bad request
                errorFunctions.sendNotFoundError(response, "Can't find something that does not exists");
            }else{
                response.status(200).json(sauceAsked);
            }
        })
        .catch(error => errorFunctions.sendServerError(response, error));
};



exports.uploadSauce = (request, response, next) => {
    //Building the sauce to upload to the data base
    const sauceObject = JSON.parse(request.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauceToUpload = new Sauce({
        ...sauceObject,
        userId : request.auth.userId,
        imageUrl : `${request.protocol}://${request.get('host')}/images/${request.file.filename}`,
        likes : 0,
        dislikes : 0,
        usersLiked : [],
        usersDisliked : [],
    });
    //Uploading the sauce to the data base
    sauceToUpload.save()
        .then(() => successFunctions.sendUploadSuccess(response))
        .catch(error => {
            //Deleting the images that was created if an error occured
            fileSystem.unlink(`images/${request.file.filename}`, () => {
                errorFunctions.sendBadRequestError(response, error);
            })
        });
};



exports.modifySauce = (request, response, next) => {
    const sauceId = request.params.id;
    //Does the request contain an image?
    const sauceInReq = request.file ?
    {
        ...JSON.parse(request.body.sauce),
        imageUrl: `${request.protocol}://${request.get('host')}/images/${request.file.filename}`,
    }:
    {
        ...request.body,
    };
    sauceInReq._id = sauceId;
    delete sauceInReq._userId;
    //Verifying that the sauce exists
    Sauce.findOne({_id: sauceId})
        .then((sauceObject) => {
            if(sauceObject===null){
                //Sauce provided does not exists : bad request
                errorFunctions.sendNotFoundError(response, "Can't modify something that does not exists");
            }else{
                //The user behind the request does not own the sauce he is trying to modify
                if(sauceObject.userId!=request.auth.userId){
                    errorFunctions.sendUnauthorizeError(response);
                }else{
                    //Deleting the previous sauce image if a new one is provided
                    if(request.file){
                        const filename = sauceObject.imageUrl.split('/images/')[1];
                        fileSystem.unlink(`images/${filename}`, () => {
                            //Modifying the sauce on the data base
                            Sauce.updateOne({ _id: sauceId}, sauceInReq)
                                .then(() => successFunctions.sendModifySuccess(response))
                                .catch(error => errorFunctions.sendServerError(response, error));
                        })
                    }else{
                        //Modifying the sauce on the data base
                        Sauce.updateOne({ _id: sauceId}, sauceInReq)
                            .then(() => successFunctions.sendModifySuccess(response))
                            .catch(error => errorFunctions.sendServerError(response, error));
                    }
                }
            }
        })
        .catch((error) => errorFunctions.sendServerError(response, error));
};



exports.deleteSauce = (request, response, next) => {
    const sauceId = request.params.id;
    //Verifying that the sauce exists
    Sauce.findOne({ _id : sauceId })
        .then(sauceObject => {
            if(sauceObject===null){
                //Sauce provided does not exists : bad request
                errorFunctions.sendNotFoundError(response, "Can't delete something that does not exists");
            }else{
                if(sauceObject.userId!=request.auth.userId){
                    //The user behind the request does not own the sauce he is trying to delete
                    errorFunctions.sendUnauthorizeError(response);
                }else{
                    //Deleting the image of the sauce on the server
                    const filename = sauceObject.imageUrl.split('/images/')[1];
                    fileSystem.unlink(`images/${filename}`, () => {
                        //Deleting the sauce from the data base
                        Sauce.deleteOne({ _id : sauceId })
                            .then(() => successFunctions.sendDeleteSuccess(response))
                            .catch(error => errorFunctions.sendServerError(response, error));
                    })
                }
            }
        })
        .catch(error => errorFunctions.sendServerError(response, error));
};



exports.likeSauce = (request, response, next) => {
    const sauceId = request.params.id;
    //Verifying that the sauce exists
    Sauce.findOne({ _id : sauceId })
        .then(sauceObject => {
            if(sauceObject===null){
                //Sauce provided does not exists : bad request
                errorFunctions.sendNotFoundError(response, "Can't like/dislike something that does not exists");
            }else{
                const userConfirmedId = request.auth.userId;
                let actionDone = false;
                switch(request.body.like){
                    case -1:
                        //Disliking
                        if(sauceObject.usersDisliked.includes(userConfirmedId)===false){
                            //Not disliked yet : okay
                            sauceObject.usersDisliked.push(userConfirmedId);
                            sauceObject.dislikes++;
                            const userIdIndexLike = sauceObject.usersLiked.indexOf(userConfirmedId);
                            if(userIdIndexLike!=-1){
                                //Cancel the user like
                                sauceObject.usersLiked.splice(userIdIndexLike);
                                sauceObject.likes--;
                            }
                            actionDone = true;
                        }
                        break;
                    case 0:
                        //Cancelling
                        const userIdIndexLike = sauceObject.usersLiked.indexOf(userConfirmedId);
                        if(userIdIndexLike!=-1){
                            //Cancel the user like
                            sauceObject.usersLiked.splice(userIdIndexLike);
                            sauceObject.likes--;
                            actionDone = true;
                        }else{
                            const userIdIndexDislike = sauceObject.usersDisliked.indexOf(userConfirmedId);
                            if(userIdIndexDislike!=-1){
                                //Cancel the user dislike
                                sauceObject.usersDisliked.splice(userIdIndexDislike);
                                sauceObject.dislikes--;
                                actionDone = true;
                            }
                        }
                        break;
                    case 1:
                        //Liking
                        if(sauceObject.usersLiked.includes(userConfirmedId)===false){
                            //Not liked yet : okay
                            sauceObject.usersLiked.push(userConfirmedId);
                            sauceObject.likes++;
                            const userIdIndexDislike = sauceObject.usersDisliked.indexOf(userConfirmedId);
                            if(userIdIndexDislike!=-1){
                                //Cancel the user dislike
                                sauceObject.usersDisliked.splice(userIdIndexDislike);
                                sauceObject.dislikes--;
                            }
                            actionDone = true;
                        }
                        break;
                }
                if(actionDone==true){
                    //Updating the likes/dislikes on the data base
                    Sauce.updateOne({ _id: sauceId}, sauceObject)
                        .then(() => successFunctions.sendLikeSuccess(response))
                        .catch(error => errorFunctions.sendServerError(response, error));
                }else{
                    //Bad request
                    errorFunctions.sendBadRequestError(response, "Can't do that");
                }
            }
        })
        .catch(error => errorFunctions.sendServerError(response, error));
};