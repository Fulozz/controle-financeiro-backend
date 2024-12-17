const mongoose = require('mongoose');

// importar o arquivo de configuração
const database = require('./db.config');

mongoose.Promise = global.Promise;


    mongoose.connect(database.cloud.database).then(
        () => {
            console.log('Conexão com o banco de dados realizada com sucesso!')
        },
        (error) => {
            console.error('Erro ao conectar com o banco de dados: ' + error)
    }
    ).catch((error) => {
        console.error('Erro ao conectar com o banco de dados: ' + error)
        process.exit();
        }   
    );
