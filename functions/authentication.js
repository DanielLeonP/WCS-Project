
function isAuth(req, res, next) {
    if (req.session.correo) {
        next();
    } else {
        res.status(401);
        res.redirect('/');
    }
}
module.exports = {
    "isAuth": isAuth,
}