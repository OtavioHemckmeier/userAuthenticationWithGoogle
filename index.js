const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const passport = require('passport');
const cookieSession = require('cookie-session')
require('./passport-setup');

app.use(cors())

app.use(bodyParser.urlencoded({ extended: false }))
 
app.use(bodyParser.json())

// Para um aplicativo real, você deve configurar isso com segurança 
app.use(cookieSession({
    name: 'tuto-session',
    keys: ['key1', 'key2']
  }))

// Middleware de autenticação que verifica se o usuário está logado
const isLoggedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.sendStatus(401);
    }
}

// Inicializa as sessões
app.use(passport.initialize());
app.use(passport.session());

// Exemplo de rotas protegidas e desprotegidas
app.get('/', (req, res) => res.send('Example Home page!'))
app.get('/failed', (req, res) => res.send('You Failed to log in!'))

// Nesta rota você pode acessar suas informações em: req.user. É verificado se o usuário está logado
app.get('/good', isLoggedIn, (req, res) => {
    console.log(req.user)
    res.send(`Welcome mr ${req.user.displayName}!`)
})

// Rotas de autenticação
app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
  function(req, res) {
    // Autenticação bem-sucedida, redirecionar para o home.
    res.redirect('/good');
  }
);

// Realiza o logout do usuário
app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})

app.listen(3000, () => console.log("Rodando o app na porta 3000!"))