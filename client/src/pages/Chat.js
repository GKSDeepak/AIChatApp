import React, { useState, useRef, useContext, useEffect } from "react";
import { FaRegCopy } from "react-icons/fa";
import Text from '../components/Text';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { AuthContext } from "../context/AuthContext";
import axios from 'axios';

const Chat = () => {
    const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const { user, logout } = useContext(AuthContext);
  const [file, setFile] = useState();
//   const chatEndRef = useRef(null);

  // const backendUrl = 'http://localhost:5001'; // Ensure the backend server is running
  // 'https://ai-chat-app-temp.vercel.app'
  const backendUrl = process.env.VITE_BACKEND_BASEURL || 'http://localhost:5001' ; // Ensure the backend server is running


  // Text-to-speech state
  const synth = window.speechSynthesis;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentUtterance, setCurrentUtterance] = useState(null);
  const [readingIndex, setReadingIndex] = useState(null);

// Voice to text logic
const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();



// Function to handle voice playback
const handleVoice = (text, index) => {
  if (synth.speaking && !isPaused) {
    // Pause speaking
    synth.pause();
    setIsPaused(true);
  } else if (isPaused && readingIndex === index) {
    // Resume speaking
    synth.resume();
    setIsPaused(false);
  } else {
    // Cancel current speech and start new speech
    if (synth.speaking) synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setReadingIndex(null);
    };

    synth.speak(utterance);
    setCurrentUtterance(utterance);
    setIsSpeaking(true);
    setIsPaused(false);
    setReadingIndex(index);
  }
};

// Function to restart reading
const handleRestart = (text) => {
  if (synth.speaking) synth.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.onend = () => {
    setIsSpeaking(false);
    setIsPaused(false);
  };
  synth.speak(utterance);
  setCurrentUtterance(utterance);
  setIsSpeaking(true);
  setIsPaused(false);
};

    // Upload file
    const upload = () => {
    const formData = new FormData();
    formData.append('file', file);
    axios.post(`${backendUrl}/upload`, formData)
      .then(() => {
        console.log('File uploaded successfully');
      })
      .catch(err => console.log(err));
    };

  const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });

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
      // credentials: 'include', // Include credentials
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
      // credentials: 'include', // Include credentials
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
            const formattedHistory = data.chatHistory.map((msg) => ({
              role: msg.sender === "user" ? "user" : "gemini",
              content: msg.message,
            }));
            setConversation(formattedHistory);
          }
        } catch (error) {
          console.error("Error fetching chat history:", error);
        }
      }
    };
  
    // Only run fetchChatHistory if user exists
    if (user && user.id) {
      fetchChatHistory();
    }
  }, [user]);

  // Copy content to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert("Copied to clipboard!");
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  if (!browserSupportsSpeechRecognition) {
    return <p>Your browser does not support speech recognition software! Try Chrome desktop, maybe?</p>;
  }

  
    
  

  const handleAuthClick = () => {
    if(user && user.token) {
      logout();
    } else {
      window.location.href = '/login';
    }
  }

  return (
    <div className="container">
      <div className="top-bar">
        <h1>Chat with me</h1>
        <button className="auth-button" onClick={handleAuthClick}>
          {user && user.token ? 'Logout' : 'Login / Signup'}
        </button>
      </div>

      {/* Chat container */}
      <div className="chat-container">
        {conversation.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            <div className="message-content">
              <strong>{msg.role === 'user' ? 'You' : 'Gemini'}:</strong>
              {msg.content.startsWith('data:image') ? (
                <img
                  src={msg.content}
                  alt="Uploaded"
                  className="chat-image"
                  onClick={() => window.open(msg.content, '_blank')}
                />
              ) : (
                <span className='content'>{msg.content}</span>
              )}
            </div>
            {/* Action buttons */}
            {msg.role === 'gemini' && (
              <div className="response-buttons">
                <button className="copy-button" onClick={() => handleCopy(msg.content)}>
                  <FaRegCopy />
                </button>
                <button className="voice-control-button" onClick={() => handleVoice(msg.content, index)}>
                  {isSpeaking && readingIndex === index ? (isPaused ? 'Resume' : 'Pause') : 'Read Aloud'}
                </button>
                <button className="voice-control-button" onClick={() => handleRestart(msg.content)}>
                  Restart
                </button>
              </div>
            )}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input section */}
      <div className="input-section">
        <textarea
          className="textarea"
          rows="4"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !loading && askQuestion()}
        />
        <div className="input-buttons">
          <input type="file" onChange={(e) => setFile(e.target.files[0])} />
          <button type="button" onClick={upload}>Upload</button>
          <button className="button" onClick={askQuestion} disabled={loading}>
            {loading ? 'Loading...' : 'Ask'}
          </button>
          <button className="button" onClick={startListening}>Start Voice</button>
          <button className="button" onClick={SpeechRecognition.stopListening}>Stop Voice</button>
        </div>
      </div>
    </div>
  );
}


export default Chat;