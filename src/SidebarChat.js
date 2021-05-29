import { Avatar } from '@material-ui/core';
import React from 'react';
import './SidebarChat.css';
import axios from './axios';
import { Link } from 'react-router-dom';

function SidebarChat({addnewChat,name,image,id}) {
    const newChat = async(e) =>{
        const roomname = prompt("Enter the name for room");
        const seed = Math.floor(Math.random() * 100); 
        await axios.post('/rooms/new',{
          name:roomname,
          imageUrl:`https://avatars.dicebear.com/api/human/${seed}.svg`
      });
    };
    return !addnewChat ? (
        <Link to={`/rooms/${id}`}>
            <div className="sidebarChat">
            <Avatar src={image}/>
                <div className="sidebarChat__info">
                    <h2>{name}</h2>
                </div>
            </div>
        </Link>
    ) : (
        <div
            onClick={newChat} 
            className="sidebarChat">
            <h2>Add new Chat</h2>
        </div>
    )
}

export default SidebarChat
