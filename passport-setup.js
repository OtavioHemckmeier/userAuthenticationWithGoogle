const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.serializeUser(function(user, done) {
    /*
    Do usuário pega apenas o id (para minimizar o tamanho do cookie) e passa apenas o id do usuário
    para o retorno de chamada feita
    */
    done(null, user);
  });
  
passport.deserializeUser(function(user, done) {
    /*
    Em vez do usuário, esta função geralmente recebe o id
    então você usa o id para selecionar o usuário do 
    banco de dados e passar o usuário obj para o retorno de chamada concluído
    */
    done(null, user);
});

passport.use(new GoogleStrategy({
    // Credencias configuradas no google cloud, indicado armazenalas em uma variável de ambiente
    clientID: "CLIENT_ID",
    clientSecret: "CLIENTSECRET",
    callbackURL: "http://localhost:3000/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    /*
     Use as informações do perfil (principalmente o id do perfil) para verificar se o usuário está registrado em seu banco de dados
     Se sim, selecione o usuário e passe-o para o callback concluído
     Caso contrário, crie o usuário, selecione-o e passe para callback
    */
    return done(null, profile);
  }
));