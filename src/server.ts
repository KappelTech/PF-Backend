import http from 'http';
import debug from 'debug';
import app from './app';

const normalizePort = (val: string) => {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

const onError = (error:any) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe' + addr : 'port' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + 'requires elevated priviliges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + 'is already in use');
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  // const bind = typeof addr === 'string' ? 'pipe' + addr : 'port' + port;
  // debug('Listening on' + bind);
};

const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

const server = http.createServer(app);
server.on('error', onError);
server.on('listening', onListening);
server.listen(port, () => {
  console.log(
    `Server is running on http://localhost:${port} and environment ${process.env.NODE_ENV}`,
  );
});
