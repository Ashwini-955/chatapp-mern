import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from "../../context/AuthContext";
import { FaPaperPlane } from 'react-icons/fa';

const MessageContainer = ({ selectedUser }) => {
  const { authUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [isAtBottom, setIsAtBottom] = useState(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10); // 10px threshold
    }
  };

  useEffect(() => {
    if (isAtBottom) {
      scrollToBottom();
    }
  }, [messages, isAtBottom]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !authUser) return;
      try {
        const response = await axios.get(
          `http://localhost:3000/api/message/${selectedUser._id}`,
          { withCredentials: true }
        );
        setMessages(response.data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();

    // Poll for new messages every 2 seconds
    const interval = setInterval(fetchMessages, 2000);

    return () => clearInterval(interval);
  }, [selectedUser, authUser]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;
    try {
      const response = await axios.post(
        `http://localhost:3000/api/message/send/${selectedUser._id}`,
        { message: newMessage },
        { withCredentials: true }
      );
      console.log('Message sent:', selectedUser._id);
      
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (!selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a user to start chatting</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-3">
        <img
          src={selectedUser.profilepic || 'https://avatar.iran.liara.run/public/boy'}
          alt={selectedUser.fullname}
          className="w-10 h-10 rounded-full"
        />
        <div>
          <p className="font-medium text-gray-800">{selectedUser.fullname}</p>
          <p className="text-sm text-gray-500">{selectedUser.username}</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={messagesContainerRef} onScroll={handleScroll} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {loading ? (
          <p className="text-center text-gray-500">Loading messages...</p>
        ) : messages.length === 0 ? (
          <p className="text-center text-gray-500">No messages yet. Start the conversation!</p>
        ) : (

          messages.map((msg) => {
  const isMe =
                  msg.senderId?.toString() === authUser?.id?.toString();
                  


  return (
    <div
  key={msg._id}
  className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}
>
  <div
    className={`max-w-xs px-4 py-2 rounded-lg ${
      isMe
        ? 'bg-cyan-500 text-white ml-auto'
        : 'bg-white text-gray-800 mr-auto'
    }`}
  >
    <p>{msg.message}</p>
    <p className="text-xs mt-1 opacity-70 text-right">
      {new Date(msg.createdAt).toLocaleTimeString()}
    </p>
  </div>
</div>

  );
})


        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Send Message */}
      <form onSubmit={handleSendMessage} className="bg-white px-4 py-3 border-t border-gray-200 flex gap-2">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
        <button
          type="submit"
          className="p-2 bg-cyan-500 text-white rounded-full hover:bg-cyan-600 transition"
        >
          <FaPaperPlane />
        </button>
      </form>
    </div>
  );
};

export default MessageContainer;
