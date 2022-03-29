import React, { useRef, useState, useCallback, useEffect } from 'react';

const Timer = ({resetBoard}) => {

  const initialTimer = localStorage.getItem("timer") ?? 600;
  const [timer, setTimer] = useState(initialTimer);

  const timeoutId = useRef(null);
  
  const countTimer = useCallback(() => {
    if(timer <= 0) {
      resetBoard();
      localStorage.setItem("timer",600);
      setTimer(600);
      return;
    }

    setTimer(timer - 1);
    localStorage.setItem("timer", timer);
  
  }, [resetBoard,timer]);

  useEffect(() => {
    timeoutId.current = setInterval(countTimer, 1000);

    return () => clearTimeout(timeoutId.current);
  }, [timer, countTimer]);

  return (
    <div className='timer'> { Math.floor(timer / 60) } : { timer % 60 } </div>
  )


}

export default Timer;