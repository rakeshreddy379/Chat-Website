import { useEffect, useState } from "react";
import socket from "./Connection";
import { useNavigate } from "react-router-dom";

function Chat() {
    const [friends, setFriends] = useState([]);
    const [friendsDetails, setDetails] = useState([]);
    const navigate = useNavigate();
    function setChattingPage(name) {
        localStorage.setItem('chattingperson', name);
        navigate('/home/chat/chatting');
    }
    useEffect(() => {
        if (!socket.connected) {
            socket.connect();
        }
        socket.on('onlineusers', onlineuser => {
            console.log(onlineuser)
            setDetails(prevState =>
                prevState.map(f => ({
                    ...f,
                    status: onlineuser.includes(f.friend) ? 'online' : 'no'
                }))
            );
        });
        async function fetching() {
            const response = await fetch('http://localhost:30002/getallfriends', {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json'
                },
                credentials: "include",
            });

            if (response.ok) {
                const data = await response.json();
                const updatedFriends = data.friends.map(value => value.userName);
                setFriends(updatedFriends);

                const friendsDetails = updatedFriends.map(friend => ({
                    friend,
                    status: '' // initially, status can be empty
                }));
console.log(friendsDetails)
                setDetails(friendsDetails);
if (!socket.connected) {
            socket.connect();
        }
        socket.on('onlineusers', onlineuser => {
            console.log(onlineuser)
            
            setDetails(prevState =>
                prevState.map(f => ({
                    ...f,
                    status: onlineuser.includes(f.friend) ? 'online' : 'no'
                }))
            );})
            console.log(friendsDetails)
            }
        }
        fetching();
    }, []);

    const friendList = friendsDetails.map((friend, index) => (
        <li className="bg-white p-4 shadow rounded"><button className="text-black bg-white" onClick={() => setChattingPage(friend.friend)} key={index}>
            {friend.friend} <span>{friend.status}</span>
        </button></li>
    ));

    return (
        <>
            <ul className="space-y-3 pt-10 overflow-auto max-w-100 h-130" >{friendList}</ul>
        </>
    );
}

export default Chat;
