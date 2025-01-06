const express = require('espress');
const session = require('espress-session');

const app = express();

//Configuración de la sesion
app.use(session({
    secret: 'mi-clave-secreta', //Secreto para firmar la cookie sesión
    resave: false, //No resguardar la sesión aunque no haya sido iniciada
    saveUnitializated: true, //Guarda la sessión aunque no haya sido iniciada
    cookie: {secure : false}//Usar secure: true sol si usas HTTPS
}
));
//Midleware para mostar detalles de la sesión
app.use((req, res, next)=>{
    if(req.session){
        if (!req.session.createdAt){
            req.session.createdAt = new Date();//Asignamos la fecha de creación de la sesión
        }
        req.session.lastAccess = new Date(); //Asignamos la ultima vez que se accedio a la sesión
    }
    next();
    
})


