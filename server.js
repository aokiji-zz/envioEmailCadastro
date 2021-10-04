const db = require('./models/db')
const express = require('express')
const handlebars = require('express-handlebars')
const app = express()
const bodyparser = require('body-parser')
const port = 8081
const path = require('path')
const session = require('express-session')
const Collection = require('./models/db')
const flash = require('connect-flash')
const nodemailer = require('nodemailer')
//mailer
const remetente = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    port: 465,
    secure: true,
    auth:{
        user: 'seuemail',
        pass: 'suasenha'
    }
})
//configuração
app.use(express.static(path.join(__dirname, 'public')))
app.engine('handlebars', handlebars({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')
app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json())

//sessão
app.use(session({
    secret: "qgprodutora",
    resave: true,
    saveUninitialized: true
}))

app.use(flash())
//middleware
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})
//rotas
app.get('/cadastro', (req, res)=>{
    res.render('user/formulario')
    console.log("Página Funcionou!!")
})

app.post('/add-cadastrar', (req, res)=>{
    //controlar acessos inválidos
    var erros = []
    //áreas vazias
    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null) {
        console.log('Email vazio')
        erros.push({texto: "Email vazio"})
    }

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        console.log('Nome vazio')
        erros.push({texto: "Nome vazio"})
    }

    if(!req.body.cep || typeof req.body.cep == undefined || req.body.cep == null) {
        console.log("CEP vazio")
        erros.push({texto: "CEP vazio"})
    }

    if(!req.body.numerocontato || typeof req.body.numerocontato == undefined || req.body.numerocontato == null){
        console.log("WhatsApp vazio")
        erros.push({texto: "WhatsApp vazio"})
    }

    //dados insuficientes ou pequenos
    if(req.body.email.length<10) {
        console.log('Email Pequeno!!')
        erros.push({texto: "Email Inválido"})
    }
    
    if(req.body.nome.length<5) {
        console.log('Nome incompleto')
        erros.push({texto: 'Nome incompleto'})
    }


    if(req.body.cep.length<8) {
        console.log('CEP incompleto')
        erros.push({texto: 'CEP incompleto'})
    }

    if(req.body.numerocontato.length<11) {
        console.log('WhatsApp incompleto')
        erros.push({texto: 'WhatsApp incompleto'})
    }

    if(req.body.senha.length<10){
        console.log("Senha muito pequena")
        erros.push({texto: 'Senha pequena'})
    }



    //se houver qualquer dado negado
    if(erros.length>0){
        res.render('user/formulario', {erros: erros})
    } else {

        Collection.findOne({email: req.body.email}).then((usuario)=>{
            if(usuario){
                console.log("Usuário existente")
                erros.push({texto: 'Email á cadastrado!!'})
                res.render('user/formulario', {erros: erros})
            } else{

              //acesso confirmado
        usuarioCadastrar = {
            email: req.body.email,
            nome: req.body.nome,
            //cpf: req.body.cpf,
            cep: req.body.cep,
            numerocontato: req.body.numerocontato,
            senha: req.body.senha
        },
        //salvando
        data = new Collection(usuarioCadastrar);
        data.save().then(()=>{
            console.log('Usuário cadastrado com sucesso!!')
        }).catch((erro)=>{
            console.log('Houve um erro '+ erro)
        })
        res.render('user/cadastrou')

        var emailASerEnviado = {
            from: 'seuemail',
            to: req.body.email,
            subject: 'Enviando Email com Node.js',
            html: "<h1>Título</h1>"
            };
        
            remetente.sendMail(emailASerEnviado, function(error){
                if (error) {
                console.log(error);
                } else {
                console.log('Email enviado com sucesso para os usuários: ' + req.body.email);
                }
                });

            }
        })
        
     }
    }
)



app.listen(port, ()=>{
   console.log(`servidor rodando na url http://localhost:${port}`)
})