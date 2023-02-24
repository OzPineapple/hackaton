const {Mongosse, default: mongoose} = require ('mongoose');
const Schema = Mongosse.Schema;

const Usuario = new Schema({
    UsrName: {type: string, require: true},
    PassWord: {type: string, require: true}
});

module.exports = mongoose.model('Usuario', Usuario);


