const mongoose = require('mongoose')

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/qgprodutora").then(()=>{
    console.log("Conectado com sucesso!!")
}).catch((erro)=>{
    console.log("Erro ao se conectar: "+ erro)
})
const UsuariosSchema = mongoose.Schema({

    email: {
        type: String,
        required: true
    },
    nome: {
        type: String,
        required: true
    },
    /*cpf: {
        type: Number,
        require: true
    },*/
    cep: {
        type: Number,
        required: true
    },
    numerocontato: {
        type: Number,
        required: true
    },
    senha: {
        type: String,
        required: true
    }
})

var Collection = mongoose.model('cadastro_mc', UsuariosSchema)