import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Addfriend(){
    const [friends, setFriends] = useState([]);
    const [friendList,setList]=useState([]);
    const navigate = useNavigate();
async function sentFriendrequest(username){
    try {
        const response = await fetch('http://localhost:30002/sendfriendrequest', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify({friendName:username}),
            credentials: "include"
        });

        if (response.ok) {
            console.log('he is your friend')
            setList(p=>
                p.filter(f=>f.username!==username)
            )

        }
    }
        catch(error){

        }
}

    useEffect(() => {
        const fetching = async () => {
            try {
                const response = await fetch('http://localhost:30002/addfriends', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: "include"
                });
                if (response.ok) {
                    const result = await response.json();
                    console.log(result.friends);
                    // Collect new friends data
                    console.log(result.friends.length)
                   if(result.friends.length !== 0){
    const newFriends = result.friends.map(value => ({
        userprofile: `http://localhost:30002/${value.userProfile}`,
        username: value.userName
    }));

    setFriends(newFriends); // still good to keep

    setList(() => {
        const f = (
            <ul>
                {newFriends.map((friend, index) => (
                    <li key={friend.username}>
                        <img
                            src={friend.userprofile}
                            className="rounded-full h-30 w-30"
                            alt={friend.username}
                        />
                        <p>{friend.username}</p>
                        <button className='bg-white border-none shadow-xl' 
                        onClick={() => sentFriendrequest(friend.username)}>
                            Add friend
                        </button>
                    </li>
                ))}
            </ul>
        );
        return f;
    });
} else {
    setList(<p>There are no extra people to make as friends</p>);
}


                    // Update state with the collected data
                  // friends state after update
                }
            } catch (error) {
                console.log(error);
                navigate('/login');
            }
        }
        fetching();
    },[]);

    return (
        <div className="h-134">
            <h1>Friends List</h1>
            <div className="overflow-x-auto">{friendList}</div>
        </div>
    );
}

export default Addfriend;
