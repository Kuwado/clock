import React, { useState, useEffect, useRef } from 'react';
import './PomodoroClock.css';

const PomodoroClock = () => {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timerLabel, setTimerLabel] = useState('Session');
  const [timeLeft, setTimeLeft] = useState(sessionLength * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);
  const audioRef = useRef(null);

  // Convert seconds to mm:ss format
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
    const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  // Handle timer tick
  useEffect(() => {
    if (isRunning) {
      setTimerInterval(
        setInterval(() => {
          setTimeLeft((prevTimeLeft) => {
            if (prevTimeLeft > 0) {
              return prevTimeLeft - 1;
            } else {
              // Timer reaches zero, switch to break/session
              audioRef.current.play();
              if (timerLabel === 'Session') {
                setTimerLabel('Break');
                setTimeLeft(breakLength * 60);
              } else {
                setTimerLabel('Session');
                setTimeLeft(sessionLength * 60);
              }
              return prevTimeLeft;
            }
          });
        }, 1000)
      );
    } else {
      clearInterval(timerInterval);
    }
    return () => clearInterval(timerInterval);
  }, [isRunning, breakLength, sessionLength, timerLabel]);

  // Handle timer start/stop
  const handleStartStop = () => {
    setIsRunning((prevIsRunning) => !prevIsRunning);
  };

  // Handle timer reset
  const handleReset = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsRunning(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimerLabel('Session');
    setTimeLeft(25 * 60);
  };

  // Handle session/break length adjustments
const adjustLength = (type, value) => {
    if (!isRunning) {
      if (type === 'break' && breakLength + value > 0 && breakLength + value <= 60) {
        setBreakLength((prevBreakLength) => prevBreakLength + value);
      }
      if (type === 'session' && sessionLength + value > 0 && sessionLength + value <= 60) {
        setSessionLength((prevSessionLength) => prevSessionLength + value);
        setTimeLeft((prevTimeLeft) => (timerLabel === 'Session' ? (prevSessionLength + value) * 60 : prevTimeLeft));
      }
    }
  };
  

  return (
    <div className="pomodoro-clock">
      <div className="length-controls">
        <div id="break-label">Break Length</div>
        <div className="controls">
          <button id="break-decrement" onClick={() => adjustLength('break', -1)}>
            -
          </button>
          <div id="break-length">{breakLength}</div>
          <button id="break-increment" onClick={() => adjustLength('break', 1)}>
            +
          </button>
        </div>
      </div>
      <div className="length-controls">
        <div id="session-label">Session Length</div>
        <div className="controls">
          <button id="session-decrement" onClick={() => adjustLength('session', -1)}>
            -
          </button>
          <div id="session-length">{sessionLength}</div>
          <button id="session-increment" onClick={() => adjustLength('session', 1)}>
            +
          </button>
        </div>
      </div>
      <div id="timer-label">{timerLabel}</div>
      <div id="time-left">{formatTime(timeLeft)}</div>
      <button id="start_stop" onClick={handleStartStop}>
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button id="reset" onClick={handleReset}>
        Reset
      </button>
      <audio id="beep" ref={audioRef} src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" />
    </div>
  );
};

export default PomodoroClock;
