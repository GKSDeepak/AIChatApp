import React, { useState, useRef, useContext, useEffect } from "react";
import { FaRegCopy } from "react-icons/fa";
import Text from '../components/Text';
import { AuthContext } from "../context/AuthContext";

const Chat = () => {
    const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const { user, logout } = useContext(AuthContext);

  const backendUrl = 'http://localhost:8000'; // Ensure the backend server is running

  // Function to submit question to the server
  const askQuestion = async () => {
    if (!question.trim()) return; // Don't send empty questions
    setLoading(true);

    try {
      // Post question to backend
      const response = await fetch(`${backendUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ userInput: question }) // Send as `userInput` to match backend
      });


     
      console.log(response);

      const data = await response.json();

      console.log(data);
      const answer = data.response; // Adjust to match the backend response key
      console.log(answer);

      // Store user question and AI response in database
    const userId = user?.id; // Assuming `user` object has `id`
    await fetch(`${backendUrl}/api/storeMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: userId,
        message: question,
        sender: "user"
      })
    });

    await fetch(`${backendUrl}/api/storeMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userId: userId,
        message: answer,
        sender: "gemini"
      })
    });

      // Update the conversation
      setConversation((prev) => [
        ...prev,
        { role: 'user', content: question },
        { role: 'gemini', content: answer }
      ]);

      // Clear the input
      setQuestion('');
    } catch (error) {
      console.error("Error fetching response from server:", error);
    } finally {
      setLoading(false);
      // Scroll to bottom of chat
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (user && user.id) {
        try {
          const response = await fetch(`${backendUrl}/api/getChatHistory/${user.id}`);
          const data = await response.json();
          if (data.success && data.chatHistory) {
            // Convert chatHistory data to the format used in conversation
            const formattedHistory = data.chatHistory.map((msg) => ({
              role: msg.sender === "user" ? "user" : "gemini",
              content: msg.message
            }));
            setConversation(formattedHistory);
          }
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
      }
    };
  
    fetchChatHistory();
  }, [user]);

  const handleAuthClick = () => {
    if(user && user.token) {
      logout();
    } else {
      window.location.href = '/login';
    }
  }

  return (
    <div className="container">
      <div>
        <h1>Chat with me</h1>
        <button className="auth-button" onClick={handleAuthClick}>
          {user && user.token ? 'Logout' : 'Login / Signup'}
        </button>
      </div>

      {/* Chat container */}
      <div className="chat-container">
        {conversation.map((msg, index) => (


          <Text key={index} msg={msg} /> 

        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input section */}
      <textarea
        className="textarea"
        rows="4"
        placeholder="Ask a question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <br />
      <button className="button" onClick={askQuestion} disabled={loading}>
        {loading ? 'Loading...' : 'Ask'}
      </button>
    </div>
  );
}

export default Chat;