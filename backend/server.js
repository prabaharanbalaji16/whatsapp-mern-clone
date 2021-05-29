import express from "express";
import mongoose from 'mongoose';
import Messages from './dbMessages.js';
import Rooms from './dbrooms.js';
import Pusher from 'pusher';
import cors from 'cors';

// app config
const app =express()
const port = process.env.PORT || 9000;
const pusher = new Pusher({
    appId: "1210852",
    key: "c55a69429954fa736654",
    secret: "c2cb43cf9d59cd94d3eb",
    cluster: "ap2",
    useTLS: true
  });
  
//   pusher.trigger("my-channel", "my-event", {
//     message: "hello world"
//   });

// middleware

app.use(express.json())
app.use(cors())

// db config
const connection_url = 'mongodb+srv://admin:admin@cluster0.b4y0h.mongodb.net/whatsappDB?retryWrites=true&w=majority';
mongoose.connect(connection_url,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true
})

// real-time functions

const db = mongoose.connection;

db.once('open',()=>{
    console.log("DB connected");
    const msgCollection = db.collection("messages");
    const changeStream = msgCollection.watch();

    changeStream.on('change',(change)=>{
        console.log(change);

        if(change.operationType ==='insert'){
            const messageDetails = change.fullDocument;
            pusher.trigger("messages","inserted",{
                name:messageDetails.name,
                message : messageDetails.message,
                timestamp : messageDetails.timestamp,
            });
        }
        else{
            console.log("Error while pushing pusher!!!");
        }
    })
    
    const roomCollection = db.collection("rooms");
    const roomStream = roomCollection.watch();
    roomStream.on('change',(change)=>{
        console.log(change);
        if(change.operationType === 'insert'){
            const roomDetails = change.fullDocument;
            pusher.trigger("rooms","inserted",{
                _id:roomDetails._id,
                name:roomDetails.name,
                imageUrl:roomDetails.imageUrl
            });
        }
        else{
            console.log('Error in pushing rooms');
        }
    })
});

// api routes
app.get('/',(req,res)=>res.status(200).send('hello world'))

// app.get('/messages/sync',(req,res)=>{
//     // eslint-disable-next-line array-callback-return
//     Messages.find((err,data) => {
//         if(err){
//             res.status(500).send(err)
//         }
//         else{
//             res.status(200).send(data)
//         }
//     })
// })

app.get('/messages/sync',(req,res)=>{
    const roomId = req.query.roomId
    Messages.find({roomId:(roomId)},(err,data) => {
        if(err){
            res.status(500).send(err)
        }
        else{
            res.status(200).send(data)
        }
    })
})

app.post('/messages/new',(req,res)=>{
    const dbMessage = req.body
    Messages.create(dbMessage,(err,data)=>{
        if(err){
            res.status(500).send(err)
        }
        else{
            res.status(201).send(data)
        }
    })
})

app.post('/rooms/new',(req,res)=>{
    const dbrooms = req.body
    Rooms.create(dbrooms,(err,data)=>{
        if(err){
            res.status(500).send(err)
        }
        else{
            res.status(201).send(data)
        }
    })
})

app.get('/rooms/sync',(req,res)=>{
    // eslint-disable-next-line array-callback-return
    Rooms.find((err,data) => {
        if(err){
            res.status(500).send(err)
        }
        else{
            res.status(200).send(data)
        }
    })
})

app.get('/rooms/id',(req,res)=>{
    // eslint-disable-next-line array-callback-return
    const id = req.query.id;
    Rooms.find({_id:(id)},(err,data)=>{
        if(err){
            res.status(500).send(err)
        }
        else{
            res.status(200).send(data)
        }
    })
})

app.listen(port,()=>console.log("Server Running"));

