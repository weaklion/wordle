import React, { useCallback } from 'react';

const Modal = ({open}) => {

  const clipBoard = useCallback((open) => {
    const today = new Date ();
    const boardData = JSON.parse(localStorage.getItem('board-data'));
    const boardWordsLength = boardData.boardWords.length; //시도한 횟수
    const boardRowStatus = boardData.boardRowStatus;

    const boardRowResult = boardRowStatus.map((el) => { 
      let result = '';

      for(let i =0; i< el.length; i++) {
        if(el[i] === 'present' || el[i] === 'correct') {
          result += '■'
        } else {
          result += '□'
        }
      }
      return result ;
    })
    console.log(boardRowResult,'boardRowResult');


    const year = today.getFullYear(); // 년도
    const month = today.getMonth() + 1;  // 월
    const date = today.getDate();  // 날짜
    const hours = today.getHours(); // 시
    const minutes = today.getMinutes();  // 분
    const seconds = today.getSeconds();  // 초

    const successText = `Wordle ${year}-${month}-${date} ${hours}:${minutes}:${seconds} ${boardWordsLength}/6 \n${boardRowResult.map(el => {  return el + '\n'}).join('')}`;
    console.log(successText);

    if(navigator.clipboard) {

      navigator.clipboard.writeText(successText)
      .then(() => {
        alert("클립보드에 복사되었습니다.");
      })
      .catch(() => {
        alert("복사 과정중 에러가 발생했습니다.")
      });
    } else {

      if(!document.queryCommandSupported("copy")) {
        return alert("복사하기가 지원되지 않는되지 않는 브라우저입니다.")
      }

      const textarea = document.createElement("textarea");
      textarea.value = successText;
      textarea.style.top = 0;
      textarea.style.left = 0;
      textarea.style.position = 'fixed';

      document.body.appendChild(textarea);
      // select() -> 사용자가 입력한 내용을 영역을 설정할 때 필요
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      alert("클립보드에 복사되었습니다.");
    }
  },[])


  return (
    <div className={open ? 'open modal' : 'modal'}>
      {open ? (
        <div className='modal-section'>
          <div className='modal-title'> you won!</div> 
          <button onClick={clipBoard} > share </button>
        </div>
        
      ) : ''}
    </div>
  )
}

export default Modal;