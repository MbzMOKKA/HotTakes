//Response that is sent if the server encountered an issue
exports.sendServerError = (response, error) => {
    response.status(500).json({ error });
};
//Response that is sent if the request is invalid
exports.sendBadRequestError = (response, error) => {
    response.status(400).json({ error });
};
//Response that is sent if the ressource asked does not exists
exports.sendNotFoundError = (response, error) => {
    response.status(404).json({ error });
};
//Response that is sent if trying to do an action without permissions
exports.sendUnauthorizeError = (response) => {
    response.status(403).json({ message: 'Unauthorized' });
};
//Response that is sent if email or password is not correct
exports.sendLogInError = (response) => {
    response.status(401).json({ message : "Email or password invalid" });
}