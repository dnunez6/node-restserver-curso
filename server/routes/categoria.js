const express = require('express');
const app = express();

const _ = require('underscore');


const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const Categoria = require('../models/categoria');



/*************************************************************
 ** Obtiene todas las categorias
 ************************************************************/
app.get('/categoria', verificaToken, (req, res) => {
    Categoria.find({}, 'descripcion usuario')
        .sort('descripcion')
        .populate('usuario', 'nombre email') //para expadir usuario con su id
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                categorias
            });


        })
});
/*************************************************************
 ** Mostrar una categoria por id
 ************************************************************/
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    // Categoria.findById(...)
    /*
    Categoria.findById(id, 'descripcion usuario')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            Categoria.countDocuments({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    total: conteo

                })
            })
        });
    */



    Categoria.findById(id)
        .populate('usuario', 'nombre email')
        .exec((err, categoriaDB) => {
            //(err, categoriaDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!categoriaDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id no encontrado'
                    }
                })
            }
            res.json({
                ok: true,
                categorias: categoriaDB
            });

        });
});

/*************************************************************
 ** Crear una nueva categoria
 ************************************************************/
app.post('/categoria', verificaToken, (req, res) => {
    //regresa la nueva categora
    //req.usuario._id

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });

});



/*************************************************************
 ** Actualiza el nombre de la categoria
 ************************************************************/
app.put('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    let body = _.pick(req.body, ['descripcion']);
    let cambioBody = {
        descripcion: req.body.descripcion
    }

    console.log(body);
    console.log(cambioBody);
    // El new:true es para que devuelva el objeto nuevo , sino devolveria el objeto viejo
    Categoria.findByIdAndUpdate(id, cambioBody, { new: true, runValidators: true }, (err, categoriaDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            categoria: categoriaDB
        })

    });


});
/*************************************************************
 ** borrado de categogría  solo un adminsitrador
 ************************************************************/
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, borrado) => {
        // console.log(err);
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!borrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        }
        // console.log(borrado);
        res.json({
            ok: true,
            categoria: borrado
        });
    });


});




module.exports = app;