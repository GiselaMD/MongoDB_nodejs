var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var mongoDB = 'mongodb://localhost/mydb';
mongoose.connect(mongoDB);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() { //abre a conexao com o mongoDB
    
    console.log("Mongoose conectado!");   
    var pacienteSchema = Schema({       //define os esquemas iniciais do banco de dados
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
    var Laboratorio = mongoose.model('Laboratorio', laboratorioSchema); //carrega os modelos no mongoose

    var paciente1 = new Paciente({ //criação de objetos
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

    paciente1.save(function(err) { //salva o paciente, já atribuindo o exame relevante ao mesmo
        if (err) console.log(err);

        var exameP1 = new Exame({
            tipos: 'Sangue, Colesterol, Glicose, Albumina',
            CRMmedico: 2546,
            paciente: paciente1._id 
        });

        exameP1.save(function(err) {
            if (err) console.log(err);
            // thats it!
            console.log("salvando exameP1") 
        });

        var exameP1_2 = new Exame({
            tipos: 'Urina, Fezes',
            CRMmedico: 2546,
            paciente: paciente1._id
        });

        exameP1_2.save(function(err) {
            if (err) console.log(err);
            // thats it!
            console.log("salvando exameP1_2")
        });
        console.log("salvando paciente1")
    });

    paciente2.save(function(err) { 
        if (err) console.log(err);

        var exameP2 = new Exame({
            tipos: 'Sangue, Colesterol, Glicose, Urina',
            CRMmedico: 2238,
            paciente: paciente2._id
        });

        exameP2.save(function(err) {
            if (err) console.log(err);
            // thats it!
            console.log("salvando exameP2")
        });
        console.log("salvando paciente2")
    });


    var bioquimico1 = new Bioquimico({ 
        CRQ: 4465,
        nome: "Thomas",
        sobrenome: "Miller",
        salario: 3200.00,
        especialidade: "Sangue, Colesterol, Glicose, Albumina",
    });

    var bioquimico2 = new Bioquimico({
        CRQ: 4278,
        nome: "Osvaldo",
        salario: 2200.00,
        especialidade: "Urina",
    });

    var bioquimico3 = new Bioquimico({
        CRQ: 2118,
        nome: "Vicente",
        sobrenome: "Kayser",
        salario: 4200.00,
        especialidade: "Fezes",

    });
    bioquimico1.save(function(err) { //salva os bioquimicos sem nenhum tipo de relacionamento
        if (err) console.log(err);
        console.log("salvando bioquimico")
    });

    bioquimico2.save(function(err) {
        if (err) console.log(err);
        console.log("salvando bioquimico")
    });
    bioquimico3.save(function(err) {
        if (err) console.log(err);
        console.log("salvando bioquimico")
    });

    var lab = new Laboratorio({
        nome: "Laboratório Bom Pastor",
        cidade: "Taquara",
        endereco: "Ed Fleming, R. Arnaldo da Costa Bard, 2940 - 101 - Centro",
        telefone: 35421939,
    });

    lab.save(function(err) { //salva o laboratorio e inicia a atualização das relações para os objetos que não foram atribuidas as relações
        if (err) console.log(err);
        else {
            Bioquimico.find({}, function(err, foundBioquimicos) { //acha todos os bioquimicos
                Laboratorio.findOne({ cidade: "Taquara" }).then((lab) => { //recupera o laboratório salvo
                    foundBioquimicos.forEach((bioq) => { //atribui todos os bioquimicos ao laboratório achado
                        bioq.laboratorio = lab
                        bioq.save();
                    })
                    lab.bioquimicos = foundBioquimicos;
                    lab.save()
                })
            }).then((bioqs) => { //recupera os bioquimicos pra fazer as relações entre pacientes e exames
                Exame.find().then((exames) => {//acha todos os exames
                    Paciente.find().then((pacientes) => { // acha todos os pacientes
                        pacientes[0].exames = exames[0] //faz assign dos pacientes com os exames
                        pacientes[1].exames = exames
                        pacientes[0].save();
                        pacientes[1].save();
                    }) 
                    bioqs[0].exames = exames; //faz assign dos bioquimicos com os exames
                    bioqs[0].save()
                    exames[0].bioquimicos = bioqs;
                    exames[0].save();
                })
            })


        }
        console.log("salvando laboratório")
    });
});
