import { Avatar, IconButton } from '@material-ui/core';
import { Chat, DonutLargeRounded,  MoreVert, SearchOutlined } from '@material-ui/icons';
import React,{useState,useEffect} from 'react';
import './Sidebar.css';
import Pusher from 'pusher-js';
import SidebarChat from './SidebarChat';
import axios from './axios';
import { useStateValue } from './StateProvider';
import { auth } from './firebase';


function Sidebar() {
  // eslint-disable-next-line no-unused-vars
  const[{ user },dispatch] = useStateValue();
  const [rooms,setRooms] = useState([]);

  useEffect(()=>{
    axios.get('/rooms/sync')
    .then((response)=>{
      setRooms(response.data)
    });
  },[])

  // Rooms pusher
  useEffect(()=>{
    var pusher = new Pusher('c55a69429954fa736654', {
      cluster: 'ap2'
    });

    var channel = pusher.subscribe('rooms');
    channel.bind('inserted', (newRoom)=> {
      // alert(JSON.stringify(newMessage));
      setRooms([...rooms,newRoom]);
    });

    return ()=>{
      channel.unbind_all();
      channel.unsubscribe();
    }
  },[rooms])

  const logout = ()=>{
    auth.signOut();
}
    return (
        <div className="sidebar">
            <div className="sidebar__header">
              <IconButton >
                <Avatar onClick={logout} src={user.photoURL} alt="" /> 
              </IconButton>
                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLargeRounded />
                    </IconButton>
                    <IconButton>
                        <Chat />
                    </IconButton>
                    <IconButton>
                        <MoreVert />
                    </IconButton>
                </div>
            </div>
            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlined />
                    <input placeholder="Search or start new chat"
                      type="text" />            
                </div>  
            </div>
            <div className="sidebar__chats">
                <SidebarChat  addnewChat/>
                {
                    rooms?.map((room)=>(
                        <SidebarChat  key={room._id} id={room._id} name={room.name} image={room.imageUrl} />
                    ))
                }
            </div>
        </div>
    )
}

export default Sidebar
