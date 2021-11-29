import dotenv from 'dotenv';
dotenv.config({ path: `./env/.env.${process.env.NODE_ENV}` })

var EnvName = process.env.NODE_ENV;
console.log('EnvName : api : ', EnvName);
console.log('Env secret ket : ', process.env.secretOrKey);
var key = {
    limitMax: 1000,
    limitPage: 10,
    errorOccured: 'Error occured, Please try again.'
}
key.port = process.env.port;
key.mongoURI = process.env.mongoURI;
key.secretOrKey = process.env.secretOrKey;
key.ipfskey = process.env.ipfskey;
key.ipfspass = process.env.ipfspass;
var keyEnvBased = {};
if (EnvName === 'demo') {
} else if (EnvName === 'local') {
    keyEnvBased = {
        emailGateway: {
            fromMail: "",
            nodemailer: {
                host: "",
                port: 465,
                secure: true,
                auth: {
                    user: '',
                    pass: '',
                },
            }
        }
    };
}
key = {...key, ...keyEnvBased};

export default key;
