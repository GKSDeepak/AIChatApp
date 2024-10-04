import React, { useState } from 'react';
import { FaRegCopy } from "react-icons/fa"; // Importing the copy icon


const Text = ({ msg }) => {
  const [isCopied, setIsCopied] = useState(false); // State to track copied status

  // Handle copy function
  const handleCopy = (content) => {
    // Copy content to clipboard
    navigator.clipboard.writeText(content)
      .then(() => {
        setIsCopied(true); // Show "Copied!" for 3 seconds
        setTimeout(() => setIsCopied(false), 3000); // Revert back to icon after 3 seconds
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  return (
    <div className={`message ${msg.role}`}>
      <strong>{msg.role === 'user' ? 'You' : 'Gemini'}:</strong>
      <span className='content'>{msg.content}</span>
      
      {/* Show copy button only for Gemini responses */}
      {msg.role === 'gemini' && (
        <button 
          className="copy-button" 
          onClick={() => handleCopy(msg.content)}
        >
          {isCopied ? 'Copied!' : <FaRegCopy />} {/* Toggle between icon and "Copied!" */}
        </button>
      )}
    </div>
  );
};

export default Text;
