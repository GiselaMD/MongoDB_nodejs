//Import the mongoose module
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//Set up default mongoose connection
var mongoDB = 'mongodb://localhost/mydb';
mongoose.connect(mongoDB);

//Bind connection to error event (to get notification of connection errors)
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
    console.log("Mongoose conectado!");
    var pacienteSchema = Schema({
        _id: Schema.Types.ObjectId,
        cpf: Number,
        nome: String,
        sobrenome: String,
        convenio: String,
        email: String,
        telefone: Number,
        endereco: String,
        exames: [{ type: Schema.Types.ObjectId, ref: 'Exame' }]
    });
    
    var exameSchema = Schema({
        numExame: Number,
        tipos: String,
        CRMmedico: Number,
        paciente: { type: Schema.Types.ObjectId, ref: 'Paciente' },
        bioquimicos: [{ type: Schema.Types.ObjectId, ref: 'Bioquimico' }]
    });

    var bioquimicoSchema = Schema({
        CRQ: Number,
        nome: String,
        sobrenome: String,
        salario: Number,
        especialidade: String,
        laboratorio: { type: Schema.Types.ObjectId, ref: 'Laboratorio' },
        exames: [{ type: Schema.Types.ObjectId, ref: 'Exame' }]
    });

    var laboratorioSchema = Schema({
        nome: String,
        cidade: String,
        endereco: String,
        telefone: Number,
        bioquimicos: [{ type: Schema.Types.ObjectId, ref: 'Bioquimico' }]
    });
    
    var Exame = mongoose.model('Exame', exameSchema);
    var Paciente = mongoose.model('Paciente', pacienteSchema);
    var Bioquimico = mongoose.model('Bioquimico', bioquimicoSchema);
    var Laboratorio = mongoose.model('Laboratorio', laboratorioSchema);

    var paciente1 = new Paciente({
        _id: new mongoose.Types.ObjectId(),
        nome: 'Gisela',
        sobrenome: 'Miranda',
        convenio: 'unimed',
        cpf: 123456789,
        email: 'gisela_difini@hotmail.com',
        telefone: 984280979,
        endereco: 'Arnaldo da Costa Bard 3129, apto 801'
    });
    var paciente2 = new Paciente({
        _id: new mongoose.Types.ObjectId(),
        nome: 'Leonardo',
        sobrenome: 'Felix',
        cpf: 8372013741,
        email: 'leofelix@hotmail.com',
        endereco: 'Universidade do Vale do Rio dos Sinos'
        });
    
    paciente1.save(function (err) {
        if (err) return handleError(err);
    
            var exameP1 = new Exame({
            tipos: 'Sangue, Colesterol, Glicose, Albumina',
            CRMmedico: 2546,
            paciente: paciente1._id    // assign the _id from the paciente
            });
        
            exameP1.save(function (err) {
            if (err) return handleError(err);
            // thats it!
            console.log("salvando exameP1")
            });

            var exameP1_2 = new Exame({
                tipos: 'Urina, Fezes',
                CRMmedico: 2546,
                paciente: paciente1._id    // assign the _id from the paciente
                });

            exameP1_2.save(function (err) {
                if (err) return handleError(err);
                // thats it!
                console.log("salvando exameP1_2")
                });
            console.log("salvando paciente1")
    });

    paciente2.save(function (err) {
        if (err) return handleError(err);
    
            var exameP2 = new Exame({
            tipos: 'Sangue, Colesterol, Glicose, Urina',
            CRMmedico: 2238,
            paciente: paciente2._id    // assign the _id from the paciente
            });
        
            exameP2.save(function (err) {
            if (err) return handleError(err);
            // thats it!
            console.log("salvando exameP2")
            });
            console.log("salvando paciente2")
    });

    var bioquimico1 = new Bioquimico({
        CRQ : 4465,
        nome : "Thomas",
        sobrenome : "Miller",
        salario : 3200.00,
        especialidade : "Sangue, Colesterol, Glicose, Albumina",
        //exames : [exameP1._id, exameP2._id] 
    });

    var bioquimico2 = new Bioquimico({
        CRQ : 4278,
        nome : "Osvaldo",
        salario : 2200.00,
        especialidade : "Urina",
        //exames : [exameP2._id, exameP1_2._id]
    });

    var bioquimico3 = new Bioquimico({
        CRQ : 2118,
        nome : "Vicente",
        sobrenome : "Kayser",
        salario : 4200.00,
        especialidade : "Fezes",
        //exames :  [exameP1_2._id] 
    });
   
    // bioquimico1.save(function (err) {
    //     if (err) return handleError(err);
    
    //         console.log("salvando bioquimico1")
    // });
    // bioquimico2.save(function (err) {
    //     if (err) return handleError(err);
    
    //         console.log("salvando bioquimico2")
    // });
    // bioquimico3.save(function (err) {
    //     if (err) return handleError(err);
    
    //         console.log("salvando bioquimico3")
    // });

    var lab = new Laboratorio({
        nome : "Laboratório Bom Pastor",
        cidade : "Taquara",
        endereco : "Ed Fleming, R. Arnaldo da Costa Bard, 2940 - 101 - Centro",
        telefone : 35421939,
        //bioquimicos : [bioquimico1, bioquimico2, bioquimico3]
    });
    

    Exame.
        find({ tipos: 'Sangue, Colesterol, Glicose, Albumina' }).
        exec(function (err, exame) {
            if (err) return handleError(err);
            exame.paciente = paciente1
            console.log('O nome do paciente vinculado ao exameP1 é: %s', exame.paciente.nome);
          });

    Paciente.find({}).exec(function (err, pacientes) {
        if (err) return handleError(err);
        console.log("Pacientes: " + pacientes + '\n');
    });
    
});