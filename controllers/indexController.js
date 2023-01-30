
exports.index_get = (req, res, next) => {
    if (req.session.correo) {          
        res.redirect('/HomePage');
    } else {
        res.render('index', { title: 'Pagina de inicio' });
    }  
}