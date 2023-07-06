import 'dotenv/config'

const config = {
    rail: process.env.RAIL_URI || 'http://localhost:8080',
    port: process.env.PORT || 8080,
    mongoUrl: process.env.MONGO_URI,
    filesPath: process.env.FILES_PATH || './files',
    secretJwt: process.env.SECRET_JWT || 'SecretJWT',
    nodemailerMail: process.env.NODEMAILER_MAIL,
    nodemailerPass: process.env.NODEMAILER_PASS
  };
  
  export default config;