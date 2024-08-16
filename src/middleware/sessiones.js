import session from 'express-session';

const sessionMiddleware = (app) => {
  app.use(
    session({
      secret: 'secret', // Cambia este valor por un secreto más seguro
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false } // Usa 'true' si estás en HTTPS
    })
  );
};

export default sessionMiddleware;
