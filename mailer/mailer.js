/**
 * Created by jankrolikowski on 17.04.2017.
 */
var nodemailer = require('nodemailer');


let selfSignedConfig = {
    host: 't.pl', port: 465,
    secure: true, // użwa TLS
    auth: {
        user: 'web20@t.pl', pass: 'stud234'
    },
    tls: {
        // nie przerywa przy błędnym certyfikacie
        rejectUnauthorized: false
    }
};

let transporter = nodemailer.createTransport(selfSignedConfig);

let mailOptions = {
    from: 'adrian98985@gmail.com',
    to: '',
    // subject: 'Aktywuj konto!',
};

var CustomMailer = {
    selfSignedConfig: selfSignedConfig,
    transporter: transporter,
    mailOptions: mailOptions
};

module.exports = CustomMailer;