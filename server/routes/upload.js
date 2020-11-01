const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();
const fs = require('fs');
const path = require('path');

const { verificaToken } = require('../middlewares/autenticacion')

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
// default options
app.use(fileUpload());


app.put('/upload/:tipo/:id', verificaToken, function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400)
            .json({
                ok: false,
                err: {
                    message: 'No se a seleccionado ningún archivo'
                }
            })
    }

    let tiposValidos = ['productos', 'usuarios'];
    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos validos son ' + tiposValidos
            }
        });
    }


    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let extension = nombreCortado[nombreCortado.length - 1];

    //console.log(extension);

    // Extenciones permitidas
    let extencionesValidas = ['png', 'jpg', 'gif', 'jpeg']

    if (extencionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Extension no es permitida. Las extenciones valiadas son ' + extencionesValidas
            }
        });
    }


    //cambiar el nombre del archivo 
    //121313
    let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            });
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioBD) => {
        if (err) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioBD) {
            borraArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borraArchivo(usuarioBD.img, 'usuarios')

        usuarioBD.img = nombreArchivo;
        usuarioBD.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            })
        })

    });
}

function borraArchivo(nombreImagen, tipo) {
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${ nombreImagen }`);
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoBD) => {
        if (err) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBD) {
            borraArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        }

        borraArchivo(productoBD.img, 'productos')

        productoBD.img = nombreArchivo;
        productoBD.save((err, productoGuardado) => {
            res.json({
                ok: true,
                usuario: productoGuardado,
                img: nombreArchivo
            })
        })

    });
}

module.exports = app;