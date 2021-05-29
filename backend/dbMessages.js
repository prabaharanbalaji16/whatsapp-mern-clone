import mongoose from 'mongoose';

const whatsappSchema = mongoose.Schema({
    message: String,
    roomId:String,
    userId:String,
    mail:String,
    name:String,
    timestamp:Object,
});

export default mongoose.model('Messages',whatsappSchema)