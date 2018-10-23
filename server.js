const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./db/db.json');
const middlewares = jsonServer.defaults();
const port = process.env.PORT || 5544;


const TOKEN = process.env.TOKEN || 'unsecuretoken'

server.use(middlewares);
server.use((req, res, next) => {
  const token = req.get('token');
  console.log(token);

  if (token === TOKEN) {
    next();
  } else {
    res.sendStatus(401);
  }
});
server.use(router);

server.listen(port);
