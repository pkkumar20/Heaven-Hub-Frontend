import React, { useEffect } from "react";
import styled from "styled-components";

const Loader = () => {
    useEffect(() => {
      document.body.style.overflow = "hidden"; // Disable scrolling
      document.body.style.pointerEvents = "none"; // Disable interaction
  
      return () => {
        document.body.style.overflow = "auto"; // Restore scrolling
        document.body.style.pointerEvents = "auto"; // Restore interaction
      };
    }, []);
  return (
    <StyledWrapper>
      <div className="loading">
        <svg viewBox="0 0 187.3 93.7" height="200px" width="300px" className="svgbox">
          <defs>
            <linearGradient y2="0%" x2="100%" y1="0%" x1="0%" id="gradient">
              <stop stopColor="pink" offset="0%" />
              <stop stopColor="blue" offset="100%" />
            </linearGradient>
          </defs>
          <path stroke="url(#gradient)" d="M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z" />
        </svg>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(23, 23, 23, 0.50); /* Dark Grey Background */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999; /* Ensure it's on top */
  pointer-events: auto; /* Block interactions */
  .svgbox {
    --blue: rgb(148, 66, 63);
    stroke: var(--blue);
    stroke-width: 5;
    fill: none;
    stroke-dasharray: 50, 14;
    stroke-dashoffset: 192;
    animation: dash_682 1.4s linear infinite;
  }

  @keyframes dash_682 {
    72.5% {
      opacity: 1;
    }

    to {
      stroke-dashoffset: 1;
    }
  }`;

export default Loader;
