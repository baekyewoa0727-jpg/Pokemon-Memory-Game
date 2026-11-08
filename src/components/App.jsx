import { useState, useEffect } from 'react'
import '../styles/App.css'
//다른 곳과 연결

const gurl = "https://pokeapi.co/api/v2/pokemon/";

//메모리 컴포넌트: 게임 전체의 상태, 점수, 클릭처리 등 

export default function Memory() {
  const [numbers, setNumbers] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [positions, setPositions] = useState([]);
  const [points, setPoints] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  //랜덤 숫자 생성 함수 
  function getRandomInt(min,max){
    return Math.floor(Math.random()*(max-min)+min)
  } 

  //포켓몬 클릭 처리 함수 - 중복으로 눌렀던 포켓몬인지 확인 
  function handleClick(num){
     if(gameOver) return;

     const altpositions = [...positions];

     if (altpositions[num] >0){
        setGameOver(true);
     } else {
        altpositions[num]++;
        setPoints(points + 1);
        setPositions(altpositions);
        setClicked(!clicked);
     }
  }


      function handleButton(){
        setPoints(0);
        setPositions(Array.from({length: 50}, () => 0));
        setGameOver(false);
        setClicked(!clicked);
      }
      useEffect(() => {
    const allPositions = Array.from({length: 50}, () => 0);
    setPositions(allPositions); 
  }, [])

  useEffect(() =>{
    const newNumbers = Array.from({length: 9}, () => getRandomInt(0,50));
    setNumbers(newNumbers);
  }, [clicked])

  return (
      <div id= "maincontainer">
        <h1>PocketMon Memory Game</h1>
        <p>Get points by clicking on an image but dont click on any more than Once!</p>
        <p>이미지를 클릭하여 점수를 얻으세요. 단, 각 이미지는 한 번만 클릭해야 합니다!</p>
        <p id="point">points: {points} </p>
        <p id="record">한 번만 클릭한 포켓몬 수: {points}</p>
        {gameOver && <p>게임 종료! 최종 점수는 {points}점입니다.</p>}
        <button onClick ={() => handleButton()}>Restart</button>
        <ul id="itemscontainer">
          {numbers.length === 9 && numbers.map((num,index) => 
            (<li key={index} onClick={() => handleClick(num)}> <Item element = {num} url = {gurl}/> </li>
            ))}
        </ul>
      </div>
  )
}
// 아이템 컴포넌트: 데이터 요청, 이름과 이미지 출력 - api
export function Item({element, url}){
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(()=> {
      const fetchPokemon = async() => {
        try{
          const response = await fetch(url + element);
          const data = await response.json();
          setPokemon(data);
        }
        catch(error){
          console.error(error);
        }
        finally{
          setLoading(false);
        }
      }

      fetchPokemon();
    }, [element, url])
    if(loading || !pokemon){
        return (
      <p>Cargando...</p>
        )
    }

    return( 
    <div className= "item">
      <h2 className="pname">{pokemon.forms[0].name}</h2>
      <img className="pimage" src={pokemon.sprites.front_default} alt="non"/>
    </div>
  )


}

//export - 다른 파일에서 사용할 수 있도록 내보내기 
//import - 다른 파일에서 가져오기 