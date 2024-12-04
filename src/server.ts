import http from 'http';
import app from './app'; // Assuming you have a valid express app

// Normalize the port to ensure it's a number or fallback to default
const normalizePort = (val: string): number => {
  const port = parseInt(val, 10);
  return isNaN(port) ? 80 : port; // Defaults to 3000 if invalid
};

const onError = (error: any) => {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof error.address === 'string' ? `pipe ${error.address}` : `port ${error.port}`;
  switch (error.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      break;
    default:
      throw error;
  }
};

const port = normalizePort(process.env.PORT);
app.set('port', port);

const server = http.createServer(app);
server.on('error', onError);
server.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http:${port} and environment ${process.env.NODE_ENV}`);
});
