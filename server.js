//Imports
const http = require('http');
const app = require('./app');
const dotenv = require("dotenv");
dotenv.config();

//Server init
function normalizePort(val){
  const port = parseInt(val, 10);
  if(isNaN(port)){
    return val;
  }
  if(port >= 0){
    return port;
  }
  return false;
}

function errorHandler(error){
  if(error.syscall !== 'listen'){
    throw error;
  }
  //Different messages for each type of adress
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  //Reacting the each type of server error
  switch(error.code){
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

const port = normalizePort(process.env.PORT);
app.set('port', port);//Sets the app's port

const server = http.createServer(app);//Create the server
server.on('error', errorHandler);
server.on('listening', () => {
  //Different messages for each type of adress
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

server.setTimeout(1000*15);//15s timeout

server.listen(port);//Start the server