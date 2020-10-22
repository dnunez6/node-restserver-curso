//*********************************************/
// PUERTO
//*********************************************/

process.env.PORT = process.env.PORT || 3000;

//*********************************************/
// ENTORNO
//*********************************************/

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//*********************************************/
// BASE DE DATOS
//*********************************************/

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URL;
}

process.env.URLDB = urlDB;



//*********************************************/
// Fecha de vencimiento
//*********************************************/
// 60 Segundos
// 60 minutos
// 24 horas


process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//*********************************************/
// SEED de autentificación 
//*********************************************/

process.env.SEED = process.env.SEED || 'este-es-seed-desarrollo';