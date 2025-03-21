import React, { useState, useEffect } from "react";
import { useAuth } from "./Auth";
const TypingEffect = () => {
     const { user, } = useAuth();
  const text = `Hello, ${user.fullname} Welcome to Heaven Hub`; // The text to type out
  const speed = 100; // Typing speed in milliseconds
  const [displayedText, setDisplayedText] = useState(""); // Tracks the current text being displayed
  const [isCursorVisible, setCursorVisible] = useState(true); // Controls the cursor's visibility

  useEffect(() => {
    let index = 0;

    const typeText = () => {
      if (index <= text.length) {
        setDisplayedText(text.substring(0, index)); // Ensures the correct substring is always set
        index++;
      } else {
        // Hide cursor once typing is complete
        setCursorVisible(false);
        clearInterval(typingInterval);
      }
    };

    const typingInterval = setInterval(typeText, speed);
    return () => clearInterval(typingInterval); // Cleanup on unmount
  }, [text]);

  return (
    <div style={styles.container}>
      <span className="text-2xl font-bold mb-4" style={styles.text}>
        {displayedText}
      </span>
    </div>
  );
};

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    fontSize: "2rem",
    display: "flex",
    alignItems: "center",
  },
  text: {
    color: "black",
  },
};

export default TypingEffect;
