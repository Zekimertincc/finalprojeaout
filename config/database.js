const mongoose = require('mongoose');
const { Schema } = mongoose; 

exports.connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connection Established...");
  } catch (error) {
    console.error(error.message);
  }
}
// create a schema 
const loginSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true }
});

// create user score schema
// Path: models/score.js

const ScoreSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    score: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

//metinlerin schema oluştur
const textSchema = new Schema({
  metinler: [{
    başlık: { type: String, required: true },
    metin: { type: String, required: true }
  }]
})

//hangi egzersiz kaç kere yapıldı bilgisi
const egzersizSchema = new Schema({ 
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  egzersiz: { type: String, required: true },
  count: { type: Number, required: true }
});



exports.collection2 = mongoose.model('Score', ScoreSchema);


exports.collection3 = mongoose.model('texts',textSchema);

exports.collection = mongoose.model('users', loginSchema);

exports.collection4 = mongoose.model('egzersiz', egzersizSchema); 
