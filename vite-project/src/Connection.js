import {io} from 'socket.io-client'
console.log(localStorage.getItem('username'))
while(localStorage.getItem('username')===null){
}
 const socket=io('http://localhost:30002',{
      query: {
        userId: localStorage.getItem('username')
      },
      autoConnect:false
    })
    export default socket
