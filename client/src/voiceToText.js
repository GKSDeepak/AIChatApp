import React, { useState, useEffect } from 'react';

const VoiceToText = ({ setQuestion }) => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition. Please use Chrome.');
      return;
    }

    const speechRecognition = new window.webkitSpeechRecognition();
    speechRecognition.continuous = true;  // Keeps listening until manually stopped
    speechRecognition.interimResults = true;  // Shows partial results as you speak
    speechRecognition.lang = 'en-US';

    speechRecognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      // Here we make sure interim results show up in the text field as you're speaking
      setQuestion((prev) => prev + interimTranscript + finalTranscript);
    };

    speechRecognition.onend = () => {
      if (isListening) {
        speechRecognition.start(); // Restart listening if still active
      }
    };

    setRecognition(speechRecognition);

    return () => {
      if (speechRecognition) {
        speechRecognition.stop();
      }
    };
  }, [isListening, setQuestion]);

  const toggleListening = () => {
    if (isListening) {
      recognition.stop();
    } else {
      recognition.start();
    }
    setIsListening(!isListening);
  };

  return (
    <button onClick={toggleListening} className="voice-button">
      {isListening ? 'Stop' : 'Speak'}
    </button>
  );
};

export default VoiceToText;
