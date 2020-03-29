import React from 'react';
import { useSelector} from 'react-redux';

//This function is responsible for rendering the level and all
//the entities in it.
export default function Level(props) {
  const map = useSelector(state => state.map)
  const grid = [];
  for (let i = 0; i < map.length; i += 20) {
    const tableRow = [];
    for (let j = 0; j < 20; j++) {
      let className;
      if (map[i+j] === '@') {
        className = 'player'
      }
      else if (map[i+j]==='#') {
        className = 'wall'
      }
      else if (map[i+j]==='e') {
        className = 'enemy'
      }
      tableRow.push(<td className = {className} key = {i+j} index = {i+j}> {map[i + j]}</td>)
    }
    grid.push(<tr key = {i/20}>{tableRow}</tr>);
  }

  return (
    <table className="table">
      <tbody>
        {grid}
      </tbody>
    </table>

  );
};