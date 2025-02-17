const express = require('express');
const session = require('express-session');
const moment = require('moment-timezone')
const app = express();

// Configuración de la sesión
app.use(session({
    secret: 'p3-DBG#DulceBal-sesionespersistentes', // Secreto para firmar la cookie sesión
    resave: false, // No resguardar la sesión aunque no haya sido modificada
    saveUninitialized: true, // Guarda la sesión aunque no haya sido inicializada
    cookie: {secure: false,  maxAge: 24 * 60 * 60 * 1000 } // Usar secure: true solo si usas HTTPS
}));

// Middleware para mostrar detalles de la sesión
/*app.use((req, res, next) => {
    if (req.session) {
        if (!req.session.createdAt) {
            req.session.createdAt = new Date(); // Asignamos la fecha de creación de la sesión
        }
        req.session.lastAccess = new Date(); // Asignamos la última vez que se accedió a la sesión
    }
    next();

});*/

app.get('/login/:User',(req,res)=>{
    const User = req.params.User;
    if (!req.session.createdAt){
        req.session.User = User;
        req.session.createdAt = new Date();
        req.session.lastAccess = new Date();
        res.send('La sesión ha sido iniciada: ');
    } else {
        res.send('Ya existe la sesión');
    }
    });

//Ruta para actualizar la fecha de ultima consulta
app.get('/update',(req,res)=>{
    if (req.session.createdAt){
        req.session.lastAccess = new Date();
        res.send('La fecha de último acceso ha sido actualizada');
    } else {
        res.send('No hay una sesión activa');
    }
});
// Ruta para acceder al estado de la sesión
app.get('/status', (req,res)=>{
    if(req.session.createdAt){
        const now = new Date();
        const started = new Date(req.session.createdAt);
        const lastUpdate = new Date(req.session.lastAccess);
        //Calcular la antiguedas de la sesión
        const sessionAgeMs = now - started;
        const hours = Math.floor(sessionAgeMs / (1000 * 60 * 60));
        const minutes = Math.floor((sessionAgeMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((sessionAgeMs % (1000 * 60)) / 1000);

        //Convertir las fechas al uso horario de CDMX
        const createdAt_CDMX = moment(started).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');
        const lastAccess_CDMX = moment(lastUpdate).tz('America/Mexico_City').format('YYYY-MM-DD HH:mm:ss');

res.json({
    mensaje: 'Estado de la sesión',
    sesionID: req.sessionID,
    inicio: createdAt_CDMX,
    ultimoAcceso: lastAccess_CDMX,
    antiguedad: `${hours} horas, ${minutes} minutos y ${seconds} segundos`
});
    } else{
        res.send('No hay una sesión activa')
    }
});



// Ruta para mostrar la información de la sesión
app.get('/session', (req, res) => {
    if (req.session && req.session.User) {
        const User = req.session.User;
        const sessionId = req.session.id;
        const createdAt = req.session.createdAt;
        const lastAccess = req.session.lastAccess;
        const sessionDuration = (new Date() - new Date(createdAt))/ 1000; // Duración de la sesión en segundos
        
        res.send(`
            <h1>Detalles de la sesión</h1>
            <p><strong>Usuario:</strong>${User}</p>
            <p><strong>ID sesión:</strong> ${sessionId}</p>
            <p><strong>Fecha de creación de la sesión:</strong> ${createdAt}</p>
            <p><strong>Último acceso: </strong> ${lastAccess}</p>
            <p><strong>Duración de la sesión (en segundos):</strong> ${sessionDuration}</p>
        `);
    } else {
        res.send(`<h1>No hay una sesión activa.</h1>`);
    }
});

// Ruta para cerrar la sesión
app.get('/logout', (req, res) => {
    if (req.session.createdAt){
        req.session.destroy((err) => {
            if (err) {
                return res.send(`Error al cerrar la sesión.`);
            }
            res.send(`Sesión cerrada exitosamente`);
        });
    } else {
        res.send(`No hay una sesión activa para cerrar`);
    }
});

// Iniciar el servidor en el puerto 3000
app.listen(3001, () => {
    console.log(`Servidor corriendo en el puerto 3001`);
});


