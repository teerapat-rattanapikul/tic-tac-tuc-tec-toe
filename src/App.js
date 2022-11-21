import { useEffect, useState } from 'react';
import jj from './image/jj.jpeg'
import lr from './image/lr.jpeg'
import './App.css';


function App() {
  const [boardSize, setBoardSize] = useState(0)
  const [dimension, setDimension] = useState(3)
  const [action, setAction] = useState([])
  const [turn, setTurn] = useState(true)
  const [turnHistory, setTurnHistory] = useState([])
  const [isGameOver, setIsGameOver] = useState(false)
  
  useEffect(()=>{
    const { innerHeight, innerWidth } = window
    const minSize = (innerHeight > innerWidth) ? (innerWidth) : (innerHeight)
    setBoardSize( 
      minSize < 1200 && minSize >= 900 ? 800 :
      minSize < 900 && minSize >= 600 ? 500 :
      200
    )
  },[])

  useEffect(()=>{
    setAction(new Array(dimension*dimension).fill('').map((dms)=>dms))
  },[dimension])

  useEffect(()=>{
    if(turnHistory.length>=dimension){
      //check horizontal
      for(var i = 0; i<dimension; i++){
        var isMatch = true
        var current = action[(i*dimension)+0]
        for(var j = 0; j<dimension; j++){
          if ((action[(i*dimension)+j] && (current !== action[(i*dimension)+j])) || !action[(i*dimension)+j])isMatch = false
        }

        if(isMatch){
          setIsGameOver(true)
          break
        }
      }

      //check vertical
      var matchVertical= []
      var startValueSetVertical = []
      for(var k = 0; k<dimension; k++){
        for(var l = 0; l<dimension; l++){
          if(k === 0){
            startValueSetVertical.push(action[0+l]?action[0+l]:'')
            matchVertical.push(action[0+l]?true:false)
          }else{
            if(matchVertical[l]===true){
              if(!action[(k*dimension)+l]){
                matchVertical[l] = false
                continue
              }
              if(action[(k*dimension)+l] !== startValueSetVertical[l]){
                matchVertical[l] = false
                continue
              }
            }
          }
        }
        if(k===dimension-1 && matchVertical.find((el)=>el===true)){
          setIsGameOver(true)
        }
      }
    }

    //check across
    var matchCross = []
    var startValueSetCross = []
    for(var m = 0; m<dimension; m++){
      for(var n = 0; n<dimension; n++){
        if(m===0){
          if(n===0 || n===dimension-1){
            startValueSetCross.push(action[0+n])
            matchCross.push(action[0+n]?true:false)
          }
        }else{
          if(m+n === dimension-1){
            if(action[(m*dimension)+n] !== startValueSetCross[1])matchCross[1]=false
          }
          if(m===n){
            if(action[(m*dimension)+n] !== startValueSetCross[0])matchCross[0]=false
          }
        }
      }
      if(m===dimension-1 && matchCross.find((el)=>el===true)){
        setIsGameOver(true)
      }
    }
    
  },[action])

  const onClickAction = (indexAction) =>{
    const newAction = [...action]
    var history = [...turnHistory]
    history.push(newAction)
    if(!newAction[indexAction] && !isGameOver){
      setTurnHistory(history)
      newAction[indexAction] = turn?'X':'O'
      setAction(newAction)
      setTurn(!turn)
    }
  }

  return (
    <>
    <input type={'number'} className={'input'} onChange={(e)=>{
        if((e.target.value < 3 || e.target.value >9) && e.target.value.trim()!=='')alert('จำนวนมิติสามารถเล่นได้คั้งแต่ 3x3 ถึง 9x9 เท่านั้น')
        else setDimension(e.target.value)
      }} 
      value={dimension}
    />
    {
      boardSize && 
      <div id="Board" style={{width:boardSize+18, height:boardSize+18}}>
        {
          new Array(dimension*dimension).fill(0).map((dms,index)=>{
            return (
              <div key={index} style={{
                      width:boardSize/dimension, 
                      height:boardSize/dimension, 
                      marginLeft:'1px',
                  }} className="Box"
                  onClick={()=>{onClickAction(index)}}
              >
                <div className="Box__inside" style={{transform: action[index]?`rotateY(${180}deg)`:''}}>
                  <div className={'flip-card-front'}>
                  </div>
                  <div className={'flip-card-back'} 
                    style={{
                      backgroundImage:`url(${action[index]==='X'?lr:jj})`,
                      backgroundSize:'cover',
                      backgroundPosition:'center',
                      filter:(isGameOver && ((turn && action[index]==='X') || (!turn && action[index]==='O')) )?`grayscale(${100}%)`:''
                    }}>
                  </div>
                </div>
              </div>
            )
          })
        }
      </div>
    }
    {/* {
      isGameOver && <p>เกมส์จบละนะ</p>
    } */}
    {/* <div id="Lisa"></div>
    <div id="Rose"></div>
    <div id="Jisoo"></div>
    <div id="Jennie"></div> */}
    </>
  );
}

export default App;
