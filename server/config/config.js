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


process.env.CADUCIDAD_TOKEN = '48h';


//*********************************************/
// SEED de autentificación 
//*********************************************/

process.env.SEED = process.env.SEED || 'este-es-seed-desarrollo';


//*********************************************/
// Google Client ID
//*********************************************/

process.env.CLIENT_ID = process.env.CLIENT_ID || '754499147583-ae03jcqf333b34r092oqpqru1qh3s275.apps.googleusercontent.com';