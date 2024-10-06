// import React, { useState, useRef } from 'react';
// import { FaRegCopy } from "react-icons/fa";
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
// import useClipboard from "react-use-clipboard"; 
// import axios from 'axios'
// import './App.css';

// function App() {
//   const [question, setQuestion] = useState('');
//   const [conversation, setConversation] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const chatEndRef = useRef(null);    
//   const backendUrl = 'http://localhost:5001'; // Ensure the backend server is running
//   const [file, setFile] = useState();

//   const upload = () => {
//     const formData = new FormData()
//     formData.append('file', file)
//     axios.post('http://localhost:5001/upload', formData)
//     .then(res => {})
//     .catch(er => console.log(er))
//   }
  

//   // voice to Text.
//   const [textToCopy, setTextToCopy] = useState();
//   const [isCopied, setCopied] = useClipboard(textToCopy, {
//       successDuration:1000
//   });
//   const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });
//   const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();
//   if (!browserSupportsSpeechRecognition) {
//       return null
//   }


//   // Function to submit question to the server
//   const askQuestion = async () => {
//     if (!question.trim()) return; // Don't send empty questions
//     setLoading(true);
//     try {
//       // Post question to backend
//       const response = await fetch(`${backendUrl}/chat`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({ userInput: question }) // Send as `userInput` to match backend
//       });


     
//       console.log(response);

//       const data = await response.json();

//       console.log(data);
//       const answer = data.response; // Adjust to match the backend response key
//       console.log(answer);

//       // Update the conversation
//       setConversation((prev) => [
//         ...prev,
//         { role: 'user', content: question },
//         { role: 'gemini', content: answer }
//       ]);

//       // Clear the input
//       setQuestion('');
//     } catch (error) {
//       console.error("Error fetching response from server:", error);
//     } finally {
//       setLoading(false);
//       // Scroll to bottom of chat
//       chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//     }
//   };


//   // Function to copy the content to the clipboard
//   const handleCopy = (text) => {
//     navigator.clipboard.writeText(text)
//       .then(() => {
//         alert("Copied to clipboard!");
//       })
//       .catch((err) => {
//         console.error("Failed to copy text: ", err);
//       });
//   };

//   // Combined function to ask question and stream response
//   const handleAsk = () => {
//     askQuestion(); // Send the question
//   };

//   return (
//     <div className="container">
//       <h1>Chat with me</h1>


//       {/* Chat container */}
//       <div className="chat-container">
//         {conversation.map((msg, index) => (
//           <div key={index} className={`message ${msg.role}`}>
//             <strong>{msg.role === 'user' ? 'You' : 'Gemini'}:</strong>
//             <span className='content'>{msg.content}</span>
//             {/* Show copy button only for Gemini responses */}
//             {msg.role === 'gemini' && (
//               <button 
//                 className="copy-button" 
//                 onClick={() => handleCopy(msg.content)}
//               >
                
//                 <FaRegCopy />
//               </button>
//             )}
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>

//       {/* Input section */}
//       <textarea
//         className="textarea"
//         rows="4"
//         placeholder="Ask a question..."
//         value={question}
//         onChange={(e) => setQuestion(e.target.value)}
//       />
//       <br />

//       <div className="main-content" onClick={() =>  setTextToCopy(transcript)}>
//                     {transcript}
//                 </div>

//                 <div className="btn-style">

//                     <input type='file' onChange={(e) => setFile(e.target.files[0])}/>
//                     <button type='button' onClick={upload}>Upload</button>


//                     <button onClick={setCopied}>
//                         {isCopied ? 'Copied!' : 'Copy to clipboard'}
//                     </button>
//                     <button onClick={startListening}>Start Listening</button>
//                     <button onClick={SpeechRecognition.stopListening}>Stop Listening</button>

//                 </div>
//     </div>
//   );
// }

// export default App;
import React, { useState, useRef, useEffect } from 'react';
// import { FaRegCopy } from "react-icons/fa";
// import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Chat from "./pages/Chat";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Register from "./pages/register";
import Login from "./pages/login";
// import axios from 'axios';
import './App.css';

const App = () => {

  return(
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Chat/>} />
        <Route path='/register' element={<Register/>} />
        <Route path='/login' element={<Login/>} />
      </Routes>
    </BrowserRouter>
  );
  
}

export default App;
// function App() {
  // const [question, setQuestion] = useState('');
  // const [conversation, setConversation] = useState([]);
  // const [loading, setLoading] = useState(false);
  // const [file, setFile] = useState();
  // const chatEndRef = useRef(null);
  // const backendUrl = `${process.env.BACKEND_BASEURL}`;
  // const backendUrl = "http://localhost:5001";
  // const backendUrl = "https://ai-chat-app-temp.vercel.app";



  // const backendUrl =  `${import.meta.env.BACKEND_BASEURL}`
  // const backendUrl = import.meta.env.VITE_BACKEND_BASEURL;


  // // Text-to-speech state
  // const synth = window.speechSynthesis;
  // const [isSpeaking, setIsSpeaking] = useState(false);
  // const [isPaused, setIsPaused] = useState(false);
  // const [currentUtterance, setCurrentUtterance] = useState(null);
  // const [readingIndex, setReadingIndex] = useState(null);

  // // Voice to text logic
  // const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  // // Update question when transcript changes
  // useEffect(() => {
  //   setQuestion(transcript);
  // }, [transcript]);

  // // Function to handle voice playback
  // const handleVoice = (text, index) => {
  //   if (synth.speaking && !isPaused) {
  //     // Pause speaking
  //     synth.pause();
  //     setIsPaused(true);
  //   } else if (isPaused && readingIndex === index) {
  //     // Resume speaking
  //     synth.resume();
  //     setIsPaused(false);
  //   } else {
  //     // Cancel current speech and start new speech
  //     if (synth.speaking) synth.cancel();

  //     const utterance = new SpeechSynthesisUtterance(text);
  //     utterance.onend = () => {
  //       setIsSpeaking(false);
  //       setIsPaused(false);
  //       setReadingIndex(null);
  //     };

  //     synth.speak(utterance);
  //     setCurrentUtterance(utterance);
  //     setIsSpeaking(true);
  //     setIsPaused(false);
  //     setReadingIndex(index);
  //   }
  // };

  // // Function to restart reading
  // const handleRestart = (text) => {
  //   if (synth.speaking) synth.cancel();
  //   const utterance = new SpeechSynthesisUtterance(text);
  //   utterance.onend = () => {
  //     setIsSpeaking(false);
  //     setIsPaused(false);
  //   };
  //   synth.speak(utterance);
  //   setCurrentUtterance(utterance);
  //   setIsSpeaking(true);
  //   setIsPaused(false);
  // };

  // // Upload file
  // const upload = () => {
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   axios.post(`${backendUrl}/upload`, formData)
  //     .then(() => {
  //       console.log('File uploaded successfully');
  //     })
  //     .catch(err => console.log(err));
  // };

  // const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });

  // // Submit question to the server
  // const askQuestion = async () => {
  //   if (!question.trim()) return;
  //   setLoading(true);
  //   try {
  //     console.log("Making request to:", backendUrl);

  //     const response = await fetch(`${backendUrl}/chat`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json"
  //       },
  //       body: JSON.stringify({ userInput: question })
  //     });

  //     const data = await response.json();
  //     const answer = data.response;

  //     setConversation((prev) => [
  //       ...prev,
  //       { role: 'user', content: question },
  //       { role: 'gemini', content: answer }
  //     ]);

  //     setQuestion('');
  //   } catch (error) {
  //     console.error("Error fetching response from server:", error);
  //   } finally {
  //     setLoading(false);
  //     chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  //   }
  // };

  // // Copy content to clipboard
  // const handleCopy = (text) => {
  //   navigator.clipboard.writeText(text)
  //     .then(() => {
  //       alert("Copied to clipboard!");
  //     })
  //     .catch((err) => {
  //       console.error("Failed to copy text: ", err);
  //     });
  // };

  // if (!browserSupportsSpeechRecognition) {
  //   return <p>Your browser does not support speech recognition software! Try Chrome desktop, maybe?</p>;
  // }

//   return (
//     <div className="container">
//       <h1>Chat with me</h1>

//       {/* Chat container */}
//       <div className="chat-container">
//         {conversation.map((msg, index) => (
//           <div key={index} className={`message ${msg.role}`}>
//             <div className="message-content">
//               <strong>{msg.role === 'user' ? 'You' : 'Gemini'}:</strong>
//               {msg.content.startsWith('data:image') ? (
//                 <img
//                   src={msg.content}
//                   alt="Uploaded"
//                   className="chat-image"
//                   onClick={() => window.open(msg.content, '_blank')}
//                 />
//               ) : (
//                 <span className='content'>{msg.content}</span>
//               )}
//             </div>
//             {/* Action buttons */}
//             {msg.role === 'gemini' && (
//               <div className="response-buttons">
//                 <button className="copy-button" onClick={() => handleCopy(msg.content)}>
//                   <FaRegCopy />
//                 </button>
//                 <button className="voice-control-button" onClick={() => handleVoice(msg.content, index)}>
//                   {isSpeaking && readingIndex === index ? (isPaused ? 'Resume' : 'Pause') : 'Read Aloud'}
//                 </button>
//                 <button className="voice-control-button" onClick={() => handleRestart(msg.content)}>
//                   Restart
//                 </button>
//               </div>
//             )}
//           </div>
//         ))}
//         <div ref={chatEndRef} />
//       </div>

//       {/* Input section */}
//       <div className="input-section">
//         <textarea
//           className="textarea"
//           rows="4"
//           placeholder="Ask a question..."
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//           onKeyPress={(e) => e.key === 'Enter' && !loading && askQuestion()}
//         />
//         <div className="input-buttons">
//           <input type="file" onChange={(e) => setFile(e.target.files[0])} />
//           <button type="button" onClick={upload}>Upload</button>
//           <button className="button" onClick={askQuestion} disabled={loading}>
//             {loading ? 'Loading...' : 'Ask'}
//           </button>
//           <button className="button" onClick={startListening}>Start Voice</button>
//           <button className="button" onClick={SpeechRecognition.stopListening}>Stop Voice</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default App;
