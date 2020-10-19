const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const _ = require('underscore');


const Usuario = require('../models/usuario');

app.get('/usuario', function(req, res) {
    let desde = req.query.desde || 0;
    desde = Number(desde);
    let limite = req.query.limite || 5;
    limite = Number(limite);

    // Usuario.find({google:true})
    Usuario.find({ estado: true }, 'nombre email role estado google img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }
            // Usuario.count({google:true}, (err, conteo) => {
            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    total: conteo

                })
            })

        })
});

//para crear data
app.post('/usuario', function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        //usuarioDB.password = null;

        res.json({
            ok: true,
            cusuario: usuarioDB
        })
    });
});
// put para actualizar data

app.put('/usuario/:id', function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);


    // El new:true es para que devuelva el objeto nuevo , sino devolveria el objeto viejo
    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })

    });

});

app.delete('/usuario/:id', function(req, res) {
    let id = req.params.id;

    let cambiaEstado = {
        estado: true
    }
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true, runValidators: true }, (err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok: true,
            usuario: usuarioDB
        })

    });

    /* borrado fisico
    // console.log(id);
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        // console.log(err);
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        };
        // if (usuarioBorrado === null) {
        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }
        // console.log(usuarioBorrado);
        res.json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
    */

});


module.exports = app;