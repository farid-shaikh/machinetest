import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
const {check, validationResult } = require('express-validator');

const userService = new UserService();
class ChatController {

  public static respond = async (socket:any,io:any) => {

    socket.on('join_chat', function(uid:any) {
      socket.join(uid);
      socket.user_id = uid;
      io.sockets.in(uid).emit('join_chat_ack', "Successfully connected to chat server." + uid);
    });

    socket.on('send_msg', function(data:any) {
      data = JSON.parse(data);
      console.log("hello send_msg call " + data.senderId);
      var conversation_id = data.conversation_id;
      var senderId = data.senderId;
      var message = data.message;
      var recieverId = data.recieverId;
      const response = { status: 200, message: "success", data: data };
      io.sockets.in(senderId).emit("send_message_ack", response);
      io.sockets.in(recieverId).emit("recieve_message", response);
    });

  }

}

export default ChatController;
