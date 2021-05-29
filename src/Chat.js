import React, { useEffect, useState } from 'react';
import { Avatar, IconButton } from '@material-ui/core';
import { AttachFile, InsertEmoticon, MoreVert, SearchOutlined,Mic } from '@material-ui/icons';
import './Chat.css';
import axios from './axios';
import { useParams } from 'react-router';
import Pusher from 'pusher-js';
import { useStateValue } from './StateProvider';


function Chat() {
  // eslint-disable-next-line no-unused-vars
  const[{ user },dispatch] = useStateValue();
    const {roomId} = useParams();
    const [input,setInput] = useState("");
    const [roomName,setroomName] = useState("");
  const [messages,setMessages] = useState([]);

    useEffect(()=>{
        async function fetchdata(){
         const res = await axios.get('/rooms/id', {
                params: {
                  id: roomId
                }
              })
              setroomName(res.data);
        }
        fetchdata()
    },[roomId])


    useEffect(()=>{
        axios.get('/messages/sync',{
            params:{
                roomId:roomId
            }
        })
          .then((response)=>{
            setMessages([...response.data])
          })
      },[roomId]);

      useEffect(()=>{
        var pusher = new Pusher('c55a69429954fa736654', {
          cluster: 'ap2'
        });
        var channel = pusher.subscribe('messages');
        channel.bind('inserted', (newMessage)=> {
          // alert(JSON.stringify(newMessage));
          setMessages([...messages,newMessage]);
        });
        // JEqa5TLgw4aiwJwtY3Ndl0e3mVG3
        return ()=>{
          channel.unbind_all();
          channel.unsubscribe();
        }
      },[messages])


    const sendMessage = async(e)=>{
        e.preventDefault();
        if(input.trim() === "" )
        {
            return
        }
        else{
            await axios.post('/messages/new',{
                message:input,
                roomId:roomId,
                userId:user.uid,
                mail:user.email,
                name:user.displayName,
                timestamp: new Date().toLocaleString(),
            });
            setInput("");
        }
    }
    return (
        <div className="chat">
            <div className="chat__header">
                <IconButton >
                    <Avatar src={roomName[0]?.imageUrl}/>
                </IconButton>

                <div className="chat__headerInfo">
                    <h3>{roomName[0]?.name}</h3>
                    {/* <p>Last seen {
                        messages[messages.length -1]?.timestamp
                    }</p> */}
                </div>
                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlined />
                    </IconButton>
                    <IconButton>
                        <AttachFile />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <div className="chat__body">
                {
                    messages.map((message)=>(
                        <p key={message._id} className={`chat__message ${message.name === user.displayName && "chat__receiver"}`}>
                            {
                                message.name !== user.displayName &&
                                    <span className="chat__name">
                                    {message.name}
                                    </span>
                            }
                            {message.message}
                            <span className="chat__timestamp">
                                {message.timestamp}
                            </span>
                        </p>
                    ))
                }
                
            </div>
            <div className="chat__footer"> 
                <IconButton>
                    <InsertEmoticon />
                </IconButton>
                <form>
                    <input value={input} onChange={(e)=>setInput(e.target.value)} placeholder="Type a message" type="text" />
                    <button onClick={sendMessage} type="submit">Send a Message</button>
                </form>
                <IconButton>
                    <Mic />
                </IconButton>
            </div>
        </div>
    )
}

export default Chat
