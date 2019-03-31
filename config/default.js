//containers for the enviroments
const enviroment = {};

enviroment.development = {
    envName: 'development',
    httpPort: 3000,
    host: '127.0.0.1'
};

//check for current enviroment
const currEnv = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

//select enviroment to expose
const enviromentToExpose = typeof(enviroment[currEnv]) === 'object' ? enviroment[currEnv] : enviroment.development;

//export the enviroment
module.exports = enviromentToExpose;