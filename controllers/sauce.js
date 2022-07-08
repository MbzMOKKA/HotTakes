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
        .then(sauceAsked => response.status(200).json(sauceAsked))
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
        .catch(error => errorFunctions.sendBadRequestError(response, error));
};
/*exports.modifySauce = (request, response, next) => {
    console.log("Request !");
};*/
exports.deleteSauce = (request, response, next) => {
    const sauceId = request.params.id;
    //Verifying that the sauce exists
    Sauce.findOne({ _id : sauceId })
        .then(sauceObject => {
            if (sauceObject.userId!=request.auth.userId) {
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
        })
        .catch(error => errorFunctions.sendServerError(response, error));
};
/*exports.likeSauce = (request, response, next) => {
    console.log("Request !");
};*/


/*
exports.changeThing = (request, response, next) => {
    const thingObject = request.file ?
        {
            ...JSON.parse(request.body.thing),
            imageUrl: `${req.protocol}://${request.get('host')}/images/${request.file.filename}`,
        }:
        {
            ...request.body,
        };
    delete thingObject._userId;
    Thing.findOne({_id: request.params.id})
        .then((thing) => {
            if (thing.userId != request.auth.userId) {
                response.status(401).json({ message : 'Not authorized'});
            } else {
                Thing.updateOne({ _id: request.params.id}, { ...thingObject, _id: request.params.id})
                .then(() => response.status(200).json({message : 'Objet modifié!'}))
                .catch(error => response.status(401).json({ error }));
            }
        })
        .catch((error) => {
            response.status(400).json({ error });
        });
};*/