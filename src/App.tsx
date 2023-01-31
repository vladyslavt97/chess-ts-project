import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import Chat from './app/chat/Chat';
import CheckMate from './app/checkmate/Checkmate';
import ChessBoard from './app/chessboard/Chessboard';
import AllUsers from './app/allusers/AllUsers';
import { RootState } from './app/redux/store';
import Restart from './app/restart/Restart';
import WhoseTurn from './app/whoseturn/WhoseTurn';
import { Signout } from './app/components/signout';
import { myId, myUserInformation } from './app/redux/boardSlice';
import { UserInfo } from './interface';

export default function App() {
  const clickedUserId = useSelector((state: RootState) => state.board.id);
  const isGameover = useSelector((state: RootState) =>state.board.gameover);
  const thePlayersToColour = useSelector((state: RootState) =>state.board.gameInserted[0]);
  console.log('thePlayersToColour: ', thePlayersToColour);
  const [myInfo, setMyInfo] = useState<any>([]);
  
  const [visibleInfoPopup, setVisibleInfoPopup] = useState<boolean>(false);
  console.log('the board: ', isGameover);


  const toggleInfoPopup = () => {
    console.log('toggleInfoPopup clicked');
    setVisibleInfoPopup(!visibleInfoPopup);
  }

  const dispatch = useDispatch();
  useEffect(() => {
    fetch('/api/myuser', {
            method: 'GET', 
            headers: {
              'Content-Type': 'application/json',
            },
        })
            .then((response) => 
              response.json())
            .then((data) => {
              setMyInfo(data.myuser)
              dispatch(myId( data.myuser.id));
              dispatch(myUserInformation( data.myuser));
            })
            .catch((error) => {
                console.error('Error caught:', error);
            });
  }, [])
  
  return (
    <div className="main-div">
      <div id='lets-play-some-chess'>
        <h3 id='first-and-last-name'>Welcome, {myInfo.first} &nbsp; {myInfo.last}</h3>
        {!thePlayersToColour && <h1 id='lets-play-some-chess-text'>Lets Play Some Chess</h1>}
        {thePlayersToColour && <div>
              {thePlayersToColour.player1_id === myInfo.id ? <h2 id='whiteside'>Your pieces are ⚪️</h2> : <h2 id='blackside'>Your pieces are ⚫️</h2>}
            </div>}
      </div>

      <div id='the-layout'>
        <AllUsers />
        <ChessBoard />
        <Chat />
      </div>
      {isGameover && 
        <div id='checkmate'>
            <CheckMate />
      </div>}

      {thePlayersToColour && <Restart />}
      
      {thePlayersToColour && <WhoseTurn />}
      {!clickedUserId && <img src='/knight.png' alt="knight" id='knight-beautiful'/>}
      <Signout />

      <h1 onClick={toggleInfoPopup} id="question-mark">?</h1>
      {visibleInfoPopup && <div id='question-mark-div' onClick={toggleInfoPopup}>
        <div id='backdrop-question'></div>
        <h1>How does it work?</h1>
        <div id='div1'>
          <h4><a href="https://en.wikipedia.org/wiki/Forsyth%E2%80%93Edwards_Notation">Forsyth–Edwards Notation</a> (FEN) - <b id='notation'>'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'</b></h4>
          <h4>After a move to e4 - <b id='notation'>'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1'</b></h4>
        </div>
        <br />

        <div id='div2'>
          <h4><a href="https://en.wikipedia.org/wiki/Algebraic_notation_(chess)">Algebraic notation</a> (AN) - a1, b2...</h4>
          <h4><small id='yellow'>(</small>&nbsp;has nothing to do with algebra&nbsp;😊&nbsp;<small id='yellow'>)</small></h4>
        </div>
        <br />

        <div id='div3'>
          <h4>1.&nbsp; server converts the FEN to the &nbsp; <small id='green'>Array<small id='pink'>&lt;</small>Array<small id='blue'>&lt;</small>object<small id='blue'>&gt;</small><small id='pink'>&gt;</small></small>&nbsp; ---&gt; &nbsp; sends the JSON to the client.</h4>
          <h4 id='onecell-h3'>2.&nbsp;<img src="/onecell.jpg" alt="one-cell" width='40px'/> &nbsp; = &nbsp; &#123; square: <small id='green'>'f7'</small>, type: <small id='green'>'p'</small>, color: <small id='green'>'b'</small> &#125;</h4>
        </div>
        <br />
        <br />
        <br />

        <div id='div4'>
        <h4 id='technologies-h4'>3. Technologies Used: &nbsp;&nbsp;<img src="/typescript.png" alt="" width="60px"/>&nbsp;&nbsp;<img src="/socketio.png" alt="" width="110px"/>&nbsp;&nbsp;<img src="/react.png" alt="" width="60px"/>&nbsp;&nbsp;<img src="/nodejs.png" alt="" width="60px"/>&nbsp;&nbsp;<img src="/npm.png" alt="" width="60px"/>&nbsp;&nbsp; -&gt; &nbsp;<b>npm chess.js</b></h4>
        </div>

      </div>}
    </div>
  );
}
