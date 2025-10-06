import React from 'react';
import styled from 'styled-components';

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="spinner">
        <div />   
        <div />    
        <div />    
        <div />    
        <div />    
        <div />    
        <div />    
        <div />    
        <div />    
        <div />    
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full viewport height */
  width: 100vw; /* Full viewport width */
  position: fixed; /* Ensure it stays on top of content */
  top: 0;
  left: 0;
  background: rgba(255, 255, 255, 0.8); /* Optional background overlay */

  .spinner {
    position: relative;
    width: 30px; /* Smaller width */
    height: 30px; /* Smaller height */
  }

  .spinner div {
    position: absolute;
    width: 40%; /* Smaller width for the bars */
    height: 120%; /* Smaller height for the bars */
    background: #000000;
    transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1%));
    animation: spinner-fzua35 1s calc(var(--delay) * 1s) infinite ease;
  }

  .spinner div:nth-child(1) {
    --delay: 0.1;
    --rotation: 36;
    --translation: 120;
  }

  .spinner div:nth-child(2) {
    --delay: 0.2;
    --rotation: 72;
    --translation: 120;
  }

  .spinner div:nth-child(3) {
    --delay: 0.3;
    --rotation: 108;
    --translation: 120;
  }

  .spinner div:nth-child(4) {
    --delay: 0.4;
    --rotation: 144;
    --translation: 120;
  }

  .spinner div:nth-child(5) {
    --delay: 0.5;
    --rotation: 180;
    --translation: 120;
  }

  .spinner div:nth-child(6) {
    --delay: 0.6;
    --rotation: 216;
    --translation: 120;
  }

  .spinner div:nth-child(7) {
    --delay: 0.7;
    --rotation: 252;
    --translation: 120;
  }

  .spinner div:nth-child(8) {
    --delay: 0.8;
    --rotation: 288;
    --translation: 120;
  }

  .spinner div:nth-child(9) {
    --delay: 0.9;
    --rotation: 324;
    --translation: 120;
  }

  .spinner div:nth-child(10) {
    --delay: 1;
    --rotation: 360;
    --translation: 120;
  }

  @keyframes spinner-fzua35 {
    0%, 10%, 20%, 30%, 50%, 60%, 70%, 80%, 90%, 100% {
      transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1%));
    }

    50% {
      transform: rotate(calc(var(--rotation) * 1deg)) translate(0, calc(var(--translation) * 1.5%));
    }
  }
`;



export default Loader;
