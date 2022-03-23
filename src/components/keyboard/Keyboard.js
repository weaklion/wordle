import React, { useCallback, useEffect } from 'react';
import { keys } from "../../constants/constants";
import "./Keyboard.css";

const Keyboard = ({boardData, handleKeyPress}) => {


  const handleKeyboard = useCallback((key) => {
    if (key.key === "Enter")
      handleKeyPress("ENTER")
    if (key.key === "Backspace")
      handleKeyPress("⌫")
    if (key.key.length === 1 && key.key.toLowerCase() !== key.key.toUpperCase())
      handleKeyPress(key.key.toUpperCase())

  },[handleKeyPress])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboard)

    return () => {
      window.removeEventListener("keydown", handleKeyboard)
    }
  }, [handleKeyboard]);

  return (
    <div className='keyboard-rows'>
      {keys.map((item, idx) => (
        <div className='row' key={idx}>
          {
            item.map((key, keyIdx) => (
              <button 
                key={keyIdx}
                // correct = 일치
                // present = 포함
                // absent = 존재 하지 않음
                className={ 
                  `
                    ${
                      boardData && boardData.correctCharArray.includes(key)? "key-correct" : 
                      (
                        boardData && boardData.presentCharArray.includes(key)? "key-present" : 
                        boardData && boardData.absentCharArray.includes(key)? "key-absent" : "" 
                      )                  
                    }
                  `
                }
                onClick ={ () => {handleKeyPress(key)}}              
              >
                {key}
              </button>
            ))
          }
        </div>
      ))}
    </div>
  )
} 


export default Keyboard;