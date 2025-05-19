import { Server } from 'socket.io';
import cors from 'cors';
import { chattingCollection } from './model/chattingdocument.js';

function setupSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST']
    }
  });
  let dict = [];
var names=[];
  io.on('connection', (socket) => {
    console.log('Connected successfully', socket.id);

    var userId = socket.handshake.query.userId;
    console.log(userId)
    setUserId(userId, socket.id);
    io.to(socket.id).emit('onlineusers',names)
socket.on('ack',(data)=>{
  const receiver=getId(data.receiver)

})

    socket.on('chat-msg', (data,callback) => {
      console.log(socket.id, ':', data.msg);
      let receiver=getId(data.name);
      if (receiver) {
        receiver.id.forEach((r)=>{
        console.log('message sent',receiver.id)
        var messagedetails={
          name:userId,
          msg:data.msg
        }
        io.to(r).emit('chat-message',messagedetails,(ack)=>{
        if(ack){
          io.to(socket.id).emit('ack',{ack:'seen'})
        }
        });
      })
      }

      let senderData = dict.find((value) => socket.id === value.id);

      async function updatingCollection() {
        try {
          const result1 = await chattingCollection.findOne({
           $and: [{$or: [
              { 'personOne.name': userId},
              { 'personTwo.name': userId}
            ]},{$or: [
              { 'personOne.name': data.name },
              { 'personTwo.name': data.name }
            ]}]
          });

// console.log(senderData.name)
          let person;
          if (result1.personOne.name === userId) {
            person = 'personOne';
            console.log('one')
          } else {
            person = 'personTwo';
            console.log('two')
          }
// console.log(person)
         const result2= await chattingCollection.updateOne(
            {
              $and: [{$or: [
                { 'personOne.name': userId },
                { 'personTwo.name': userId }
              ]},{$or: [
                { 'personOne.name': data.name },
                { 'personTwo.name': data.name }
              ]}]
            },
            {
              $push: {
                [`${person}.messages`]: {
                  message: data.msg,
                  time: Date.now()
                }
              }
            }
          );
          // console.log(result2)
callback({status:'ok'})

         
        } catch (err) {
          console.error('Error updating document:', err);
          callback({status:'error'})
        }
      }

      updatingCollection();
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
      var name=getName(socket.id)
      names = names.filter((value) => value !== name);
      let nameInTheDict=dict.find((value) => value.name === userId)//finding the length of the id's of the name
      if(nameInTheDict.id.length==1){
      dict = dict.filter((value) => value.id[0] !== socket.id);
      names.filter((value)=>value!==userId)
      }
      else{
        dict.forEach((value, index) => {
          if (value.name === userId) {
              dict[index].id = dict[index].id.filter((id) => id !== socket.id);
          }
      });
      
      }
      console.log(dict)
    });
  });
  function setUserId(name, id) {
    if((dict.find((value)=>value.name===name))){
dict.forEach((value)=>{
  if(value.name===name){
    value.id.push(id)
  }
})

    }
    else{
    dict.push({ name: name, id: [id] });
    names.push(name)}
    console.log('Dictionary is ', dict);
  }
  function getName(id) {
    console.log(id);
    return dict.find((value)=>value.id === id);
  }
  function getId(id) {
    console.log(id);
    return dict.find((value) => value.name === id);
  }
}

export { setupSocket };
