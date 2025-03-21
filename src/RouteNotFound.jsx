import React from "react";
import styled from "styled-components";
import Lottie from "lottie-react";
import { useNavigate } from "react-router-dom";
import animationData from "./Animation/Animation.json"; // Ensure the correct path

const NotFound = () => {
  const navigate = useNavigate(); // Hook for navigation

  return (
    <StyledWrapper>
      <div className="content">
        <Lottie animationData={animationData} loop autoplay className="animation" />

        <h1 className="error-code">404</h1>
        <h2 className="message">Oops! Page Not Found</h2>
        <p className="description">
          It looks like the page you're looking for doesn't exist. It may have been moved,
          deleted, or the URL might be incorrect.
        </p>
        <p className="suggestion">
          Try going back to the homepage or check the URL for errors.
        </p>

        <button className="home-button mt-3 mb-5" onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #ffffff; /* White background */
  text-align: center;

  .content {
    max-width: 600px;
    padding: 20px;
  }

  .animation {
    width: 300px;
    height: 300px;
    margin: 0 auto 20px;
  }

  .error-code {
    font-size: 80px;
    font-weight: bold;
    color: #ff4a4a;
    margin-bottom: 10px;
  }

  .message {
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 15px;
    color: #333;
  }

  .description,
  .suggestion {
    font-size: 16px;
    color: #666;
    margin-bottom: 10px;
  }

  .home-button {
    padding: 12px 25px;
    background: #ff4a4a;
    color: white;
    font-weight: bold;
    border-radius: 30px;
    border: none;
    cursor: pointer;
    font-size: 18px;
    transition: 0.3s;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }

  .home-button:hover {
    background: #d63c3c;
    transform: scale(1.05);
  }
`;

export default NotFound;
