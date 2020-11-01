const express = require('express');
const app = express();

const { verificaToken } = require('../middlewares/autenticacion');


const Producto = require('../models/producto');


/********************************************************************
 * Buscar productos
 ********************************************************************/
app.get('/producto/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let regex = new RegExp(termino, 'i');

    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .exec((err, productosBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                productos: productosBD
            });
        });

});

/********************************************************************
 * obtener todos los productos
 ********************************************************************/
app.get('/producto', verificaToken, (req, res) => {
    //trae todos los productos 
    // populate: usuario categoria
    //paginado

    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 2;
    limite = Number(limite);

    // Usuario.find({google:true})
    Producto.find({ disponible: true }, 'nombre precioUni descripcion categoria usuario')
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productosBD) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            //Collection.countDocuments
            // Usuario.count({google:true}, (err, conteo) => {
            Producto.countDocuments({ disponible: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    productos: productosBD,
                    total: conteo

                })
            })

        })
});


/********************************************************************
 * obtener un producto
 ********************************************************************/
app.get('/producto/:id', verificaToken, (req, res) => {

    let id = req.params.id;
    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El id no encontrado'
                    }
                })
            }
            res.json({
                ok: true,
                producto: productoDB
            });

        });
});



/********************************************************************
 * crear un producto
 ********************************************************************/
app.post('/producto', verificaToken, (req, res) => {
    // grabar un el usuario 
    // graba una categoria

    //regresa la nueva categora
    //req.usuario._id

    let body = req.body;

    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria

    });

    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoDB
        })
    });
});


/********************************************************************
 * modificar un producto
 ********************************************************************/
app.put('/producto/:id', verificaToken, (req, res) => {
    // grabar un el usuario 
    // graba una categoria

    let id = req.params.id;
    let cambioBody = {
        nombre: req.body.nombre,
        precioUni: req.body.precioUni,
        descripcion: req.body.descripcion,
        categoria: req.body.categoria
    }

    // El new:true es para que devuelva el objeto nuevo , sino devolveria el objeto viejo
    Producto.findByIdAndUpdate(id, cambioBody, { new: true, runValidators: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                producto: productoDB
            })

        });
});


/********************************************************************
 * eliminar un producto
 ********************************************************************/
app.delete('/producto/:id', verificaToken, (req, res) => {
    // Borrado logico (con disponible false)
    let id = req.params.id;
    let cambioBody = {
        disponible: false,
    }

    // El new:true es para que devuelva el objeto nuevo , sino devolveria el objeto viejo
    Producto.findByIdAndUpdate(id, cambioBody, { new: true, runValidators: true })
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            res.json({
                ok: true,
                producto: productoDB
            })

        });
});

module.exports = app;