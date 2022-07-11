//Response that is sent if an account is successfully created
exports.sendAccountCreationSuccess = (response) => {
    response.status(201).json({ message : "User account created" });
};
//Response that is sent if an upload is successfully done
exports.sendUploadSuccess = (response) => {
    response.status(201).json({ message : "Upload successful" });
};
//Response that is sent if a deletion is successfully done
exports.sendDeleteSuccess = (response) => {
    response.status(200).json({ message : "Deletion successful" });
};
//Response that is sent if a modification is successfully done
exports.sendModifySuccess = (response) => {
    response.status(200).json({ message : "Modification successful" });
};
//Response that is sent if a like/dislike is successfully done
exports.sendLikeSuccess = (response) => {
    response.status(200).json({ message : "Like/Dislike successful" });
};