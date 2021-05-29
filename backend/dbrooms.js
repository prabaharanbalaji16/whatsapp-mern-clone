import mongoose from 'mongoose';

const roomSchema = mongoose.Schema({
    name:String,
    imageUrl:String
});

export default mongoose.model('Rooms',roomSchema)