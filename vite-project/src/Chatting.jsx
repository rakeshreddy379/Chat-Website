import { useEffect, useState } from "react";
import socket from "./Connection";
import { useRef } from "react";
import Cookies from 'js-cookie'

function Chatting() {
    const chattingperson = localStorage.getItem('chattingperson');
    const [message, setMessage] = useState('');
    const [receivedMessages, setReceivedMessages] = useState([]);
    const messageContainerRef=useRef(null)
    const oberver=new IntersectionObserver((entries)=>{
        entries.forEach((entry)=>{
            if(entry.isIntersecting){
                data={
                    message:1,
                    receiver:chattingperson
                }
                socket.emit('ack',data)
            }
        })
    })
    var setMessagesPattern;
    function handleText(event) {
        setMessage(event.target.value);
    }
    function sendMessage() {
        console.log(`message is ${message}`);
        const data = {
            name: chattingperson,
            msg: message
        };
        socket.emit('chat-msg', data, (ack) => {
            console.log(ack.status);
        });
        const value={
            message:message,
            time:Date.now(),
            key:'pl-70'
        }
        setMessage('')
        setReceivedMessages([...receivedMessages,value])
    }
     
    socket.on('chat-message',(message,ack)=>{
        var name=message.name
        
            const value={
                message:message.msg,
                
                time:Date.now(),
                key:'ml-0'
            }
            console.log('ne msg recieved')
            if(name===chattingperson){
            setReceivedMessages([...receivedMessages,value])
            }
         })
     
    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }

        async function getChats() {
            const response = await fetch('http://localhost:30002/getchat', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ receiver: chattingperson })
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data.result);

                let messages = [];
                if (localStorage.getItem('username') === data.result.personOne.name) {
                    messages = data.result.personOne.messages.map(msg => ({
                        ...msg, key: 'pl-70'
                    }));
                    messages = messages.concat(data.result.personTwo.messages.map(msg => ({
                        ...msg, key: 'ml-0'
                    })));
                } else {
                    messages = data.result.personTwo.messages.map(msg => ({
                        ...msg, key: 'pl-80 w-90'
                    }));
                    messages = messages.concat(data.result.personOne.messages.map(msg => ({
                        ...msg, key: 'ml-0'
                    })));
                }
messages.sort((a, b) => Number(a.time) - Number(b.time));
                
                setReceivedMessages(messages);
           }
        }
        getChats();
    }, [chattingperson]);
    useEffect(() => {
        if (messageContainerRef.current) {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
        }
    }, [receivedMessages]);
        setMessagesPattern = receivedMessages.map((value, index) =>
        <li key={index} className={value.key}>{value.message}</li>
    );
    return (
        <div className='ml-20'>
            <button className="bg-[#080814] bg-white  shadow-xl block">{chattingperson}</button>
            <div className='h-110 overflow-auto scrollbar-none 'ref={messageContainerRef}>{setMessagesPattern}</div>
            <div className='typing'>
                <input type='text' value={message}onChange={handleText} placeholder="type something"></input> 
                <button className='bg-white  shadow-xl'onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
}
export default Chatting;
