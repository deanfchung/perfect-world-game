import React from 'react';
import { useSelector } from 'react-redux';

//This function is responsible for rendering the level and all
//the entities in it.
export default function Level() {
  const map = useSelector(state => state.map)
  const symbolMap = { '@': 'player', '#': 'wall', 'e': 'enemy','.': 'empty' }
  const gameBoard = [];

  for (let i = 0; i < map.length; i += 20) {
    const tableRow = [];

    for (let j = 0; j < 20; j++) {
      let className = symbolMap[map[i + j]];
      tableRow.push(<td 
        className={className}
        key={i + j}
        index={i + j}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '11px',
          height: '17px'
        }}>
          {map[i + j]}
        </div>
      </td>)
    }
    gameBoard.push(<tr key={i / 20}>{tableRow}</tr>);
  }

  return (
    <table className="table">
      <tbody>
        {gameBoard}
      </tbody>
    </table>

  );
};