import React, { useEffect, useState } from 'react';
import Keyboard from './components/keyboard/Keyboard';
import Timer from './components/Timer';
import Modal from './components/Modal';
import word from './constants/word.json';
import './App.css'

const WORD_LIST = word;

const App = () => {
  const [boardData, setBoardData] = useState(JSON.parse(localStorage.getItem('board-data')));
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(false);
  const [charArray, setcharArray] = useState([]);
  const [openModal, setOpenModal] = useState(false);


  const handleMessage = (message) => {
    setMessage(message);
    setTimeout(() => {
      setMessage(null);
    },3000)
  }


  const handleError = () => {
    setError(true);
    setTimeout(() => {
      setError(false)
    },3000)
  }

  const enterBoardWord = (word) => {
    let boardWords=boardData.boardWords;
    let boardRowStatus=boardData.boardRowStatus; // 총 상태 배열
    let solution=boardData.solution; // 답
    let presentCharArray=boardData.presentCharArray; // 포함하는 문자를 넣는 배열
    let absentCharArray=boardData.absentCharArray;  // 틀린 문자를 넣는 배열
    let correctCharArray=boardData.correctCharArray; // 일치하는 문자를 넣는 배열
    let rowIndex=boardData.rowIndex;
    let rowStatus =[];  // 상태 배열
    let matchCount=0; //맞은 수
    let status=boardData.status;

    for(let i =0; i< word.length; i ++) {
      if(word.charAt(i) === solution.charAt(i)) { //일치할 시
        matchCount++;
        rowStatus.push("correct");
        if(!correctCharArray.includes(word.charAt(i)))  //correctChartArray에 문자가 없으면
        { 
          correctCharArray.push(word.charAt(i))
        }
        if(presentCharArray.indexOf(word.charAt(i)) !== -1) //presentCharArray에 일치한 문자 값이 있으면 뺀다.
        {
          presentCharArray.splice(presentCharArray.indexOf(word.charAt(i)), 1);
        }
      } else if (solution.includes(word.charAt(i))) { // 포함하는 문자가 있을 시 
        rowStatus.push("present");
        if(!presentCharArray.includes(word.charAt(i)) &&
          !correctCharArray.includes(word.charAt(i)))
        {
          presentCharArray.push(word.charAt(i));
        }
      } else {
        rowStatus.push("absent") //없을 시
        if(!absentCharArray.includes(word.charAt(i))) {
          absentCharArray.push(word.charAt(i));
        }
      }
    }
    if(matchCount === 5) { // 5개 다 맞추면
      status="SUCCESS";
      setOpenModal(true);

    } else if(rowIndex + 1 === 6) {
      status="FAIL";
      handleMessage("Hard luck! try again with new word");
    }
    boardRowStatus.push(rowStatus);
    boardWords[rowIndex] = word;
    const newBoardData = {
      ...boardData,
      "rowIndex" : rowIndex + 1,
      "boardWords" : boardWords,
      "boardRowStatus" : boardRowStatus,
      "presentCharArray" : presentCharArray,
      "absentCharArray" : absentCharArray,
      "correctCharArray" : correctCharArray,
      "status" : status
    }
    setBoardData(newBoardData);
    localStorage.setItem("board-data", JSON.stringify(newBoardData));
  }

  const enterCurrentText = (word) => {
    const rowIndex = boardData.rowIndex;
    const boardWords = boardData.boardWords;
    boardWords[rowIndex] = word;
    const newBoardData = {...boardData, "boardWords" : boardWords};
    console.log(newBoardData,'new1')
    setBoardData(newBoardData);

  }

  const handleKeyPress = (key) => {
    console.log(key,'key')
    if(boardData.rowIndex > 5 || boardData.status === "SUCCESS") return ;
    if(key === "ENTER" ) {
      if(charArray.length === 5) {
        let word = charArray.join("").toLowerCase();
        if(!WORD_LIST.includes(word)) {
          handleError();
          handleMessage("not in word list");
          return ;
        }
          enterBoardWord(word);
          setcharArray([]);
      } else {
        handleMessage("Not enough letters")
      }
      return ;
    }
    if(key === "\u232b")  { //backspace
      charArray.splice(charArray.length-1, 1);
      setcharArray([...charArray]);
    } 
    else if (charArray.length < 5 ) {
      charArray.push(key);
      setcharArray([...charArray]);
    }
    enterCurrentText(charArray.join("").toLowerCase());
  }

  const resetBoard = () => {
    let wordIndex = Math.floor(Math.random() * WORD_LIST.length);

    let newBoardData = {
        // correct = 일치
        // present = 포함
        // absent = 존재 하지 않음
      ...boardData, 
      "solution" : WORD_LIST[wordIndex],
      "rowIndex" : 0,
      "boardWords" : [],
      "boardRowStatus" : [],
      "presentCharArray" : [],
      "absentCharArray" : [],
      "correctCharArray" : [],
      "status" : "IN_PROGRESS"
    };

    setBoardData(newBoardData);
    localStorage.setItem("board-data", JSON.stringify(newBoardData));            
  }

  useEffect(() => {
    console.log(boardData,'boardData')
    if(!boardData) {
      console.log('실행실행');
      const wordIndex = Math.floor(Math.random() * WORD_LIST.length);
      const newBoardData = {
          // correct = 일치
          // present = 포함
          // absent = 존재 하지 않음
        ...boardData, 
        "solution" : WORD_LIST[wordIndex],
        "rowIndex" : 0,
        "boardWords" : [],
        "boardRowStatus" : [],
        "presentCharArray" : [],
        "absentCharArray" : [],
        "correctCharArray" : [],
        "status" : "IN_PROGRESS",
      };
      setBoardData(newBoardData);
      localStorage.setItem("board-data", JSON.stringify(newBoardData));              
    } 
  },[]);


  return (
    <div className='container'>
      <div className='top'>
        {boardData ? <Timer resetBoard={resetBoard}/> : '' }
        <div className='title'> WORDLE CLONE</div>
      </div>
      {message && <div className='message'>{message}</div>}
      <div className='cube'>
        {[0,1,2,3,4,5].map((row, rowIdx) => (
          <div key={rowIdx} className={`cube-row ${boardData && row === boardData.rowIndex && error && "error"}`}>
            {
              [0,1,2,3,4].map((column, letterIdx) => (
                <div key={letterIdx} className={`letter ${boardData && boardData.boardRowStatus[row] ? boardData.boardRowStatus[row][column] : "" }`}>
                  { boardData && boardData.boardWords[row] && boardData.boardWords[row][column]}
                </div>
              ))
            }
          </div>
        ))}
      </div>
      <div className='bottom'>
        <Keyboard boardData={boardData} handleKeyPress={handleKeyPress} />
      </div>
      <Modal open={openModal} />
    </div>
  )

}

export default App;
