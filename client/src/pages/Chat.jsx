
// import React, { useState, useRef,useContext,useEffect} from 'react';
// import Text from '../components/Text';
// import FileUpload from '../components/FileUpload';
// import StartVoiceButton from '../components/StartVoiceButton';
// import { AuthContext } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import '../App.css';

// const Chat = () => {
//   const [question, setQuestion] = useState('');
//   const [conversation, setConversation] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const chatEndRef = useRef(null);
//   const [uploadedFile, setUploadedFile] = useState(null); 

//   const navigate = useNavigate();

//   const { user, logout } = useContext(AuthContext);

//   const backendUrl = 'http://localhost:5000'; // Ensure the backend server is running

//   // Function to submit question to the server
//   const askQuestion = async () => {
//     if (!question.trim() && !uploadedFile) return; // Don't send empty questions
//     setLoading(true);


//     // Prepare the form data
//     const formData = new FormData();
//     if (question.trim()) {
//       formData.append('userInput', question); // Send question if it exists
//     }
//     if (uploadedFile) {
//       formData.append('file', uploadedFile); // Append the uploaded file
//     }

//     // Update the conversation with the user question
//     setConversation((prev) => [
//       ...prev,
//       { role: 'user', content: question },
//     ]);

//     try {
//       const responseStream = await fetch(`${backendUrl}/chat`, {
//         method: "POST",
//         body : formData
//         // headers: {
//         //   "Content-Type": "application/json"
//         // },
//         // body: JSON.stringify({ userInput: question }) // Send as JSON
//       });
//       // console.log(responseStream);
//       // Create a new ReadableStream to handle the response
//       const reader = responseStream.body.getReader();
//       // console.log(reader);
//       const decoder = new TextDecoder("utf-8");
//       // console.log(decoder);
      
//       let currentGeminiMessage = ""; // Holds the current message being built

//       while (true) {
//         const { done, value } = await reader.read();
//         if (done) break;
  
//         const chunk = decoder.decode(value, { stream: true });
//         currentGeminiMessage += chunk; // Accumulate the streamed content
  
//         // Update the conversation to reflect the current message
//         setConversation((prev) => {
//           const lastIndex = prev.length - 1;
//           // Check if the last message is from Gemini
//           if (prev[lastIndex]?.role === 'groq') {
//             const updatedConversation = [...prev];
//             updatedConversation[lastIndex].content = currentGeminiMessage; // Update the last message
//             return updatedConversation;
//           } else {
//             return [...prev, { role: 'groq', content: currentGeminiMessage }]; // Add new message
//           }
//         });
  
//         // Scroll to the bottom of the chat
//         chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//       }


      
  
      
//       // Clear the input
//       setQuestion('');
//     } catch (error) {
//       console.error("Error fetching response from server:", error);
//       setLoading(false);
//     }finally{
//       setLoading(false);
//     }
//   };





//   const handleAuthClick = () => {
//     if(user && user.token) {
//       logout();
//       navigate("/", { replace: true });
//       window.location.reload();
//     } else {
//       window.location.href = '/';
//     }
//   }

//   return (
//     <div className="container">
//       <h1>Chat with me</h1>
//       <button className="auth-button" onClick={handleAuthClick}>
//           {user && user.token ? 'Logout' : 'Login / Signup'}
//         </button>
//       <div className="chat-container">
//         {conversation.map((msg, index) => (
//           <Text key={index} msg={msg} />
//         ))}
//         <div ref={chatEndRef} />
//       </div>
//       <textarea
//         className="textarea"
//         rows="4"
//         placeholder="Ask a question..."
//         value={question}
//         onChange={(e) => setQuestion(e.target.value)}
//       />
//       <br />
//       <div className='all-btns'>
//         <FileUpload onFileUpload={setUploadedFile} />
//         <div>
//           <StartVoiceButton setQuestion={setQuestion} question={question} />
        
//           <button className="button" onClick={askQuestion} disabled={loading}>
//             {loading ? 'Loading...' : 'Ask'}
//           </button>
//         </div>
        
//       </div>
      
      
//     </div>
//   );
// }

// export default Chat;




import React, { useState, useRef, useContext, useEffect } from 'react';
import Text from '../components/Text';
import FileUpload from '../components/FileUpload';
import StartVoiceButton from '../components/StartVoiceButton';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Chat = () => {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [uploadedFile, setUploadedFile] = useState(null);

  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const backendUrl = 'http://localhost:5000';
  console.log(user);

 

  
  

  const askQuestion = async () => {
    if (!question.trim() && !uploadedFile) return;
    setLoading(true);

    const formData = new FormData();
    if (question.trim()) formData.append('userInput', question);
    if (uploadedFile) formData.append('file', uploadedFile);

    setConversation(prev => [...prev, { role: 'user', content: question }]);

    try {
      const responseStream = await fetch(`${backendUrl}/chat/${user.id}`, {
        method: "POST",
        body: formData,
      });

      const reader = responseStream.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let currentGeminiMessage = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        currentGeminiMessage += chunk;

        setConversation(prev => {
          const lastIndex = prev.length - 1;
          if (prev[lastIndex]?.role === 'groq') {
            const updatedConversation = [...prev];
            updatedConversation[lastIndex].content = currentGeminiMessage;
            return updatedConversation;
          } else {
            return [...prev, { role: 'groq', content: currentGeminiMessage }];
          }
        });

        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }



      setQuestion('');
    } catch (error) {
      console.error("Error fetching response from server:", error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthClick = () => {
    if (user && user.token) {
      logout();
      navigate("/", { replace: true });
      window.location.reload();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="container">
      <h1>Chat with me {user.email}</h1>
      <button className="button" onClick={handleAuthClick}>
        {user && user.token ? 'Logout' : 'Login / Signup'}
      </button>
      <div className="chat-container">
        {conversation.map((msg, index) => (
          <Text key={index} msg={msg} />
        ))}
        <div ref={chatEndRef} />
      </div>
      <textarea
        className="textarea"
        rows="4"
        placeholder="Ask a question..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />
      <br />
      <div className='all-btns'>
        <FileUpload onFileUpload={setUploadedFile} />
        <div>
          <StartVoiceButton setQuestion={setQuestion} question={question} />
          <button className="button" onClick={askQuestion} disabled={loading}>
            {loading ? 'Loading...' : 'Ask'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
