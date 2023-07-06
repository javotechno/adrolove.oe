import { Router } from "express";
import passport from "passport";
import { changeRole, githubCallback, loginGet, loginPost, requestPasswordReset, resetPassword, updatePassword } from "../controllers/user.controller.js";

const sessionRouter = Router();

sessionRouter.get("/login", loginGet);

sessionRouter.post("/login", loginPost);

// Login local con passport
sessionRouter.post("/signup", passport.authenticate('singup', {
  failureRedirect: '/errorLogin',
  successRedirect: '/login',
  passReqToCallback: true
}))

sessionRouter.get('/login/github', passport.authenticate('github', {scope: ['user:email']  , session: false}))

sessionRouter.get('/login/github/callback', passport.authenticate('github'), githubCallback)

// Ruta para restablecer la contraseña
// sessionRouter.post('/reset-password', resetPassword);
sessionRouter.post('/request-password', requestPasswordReset);
sessionRouter.post('/reset-password', resetPassword);

// Ruta para actualizar la contraseña
sessionRouter.post('/update-password', updatePassword);

// sessionRouter.post('/upload', uploadDoc)

export default sessionRouter;
