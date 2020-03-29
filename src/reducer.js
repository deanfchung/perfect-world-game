import * as actions from './actions';
import BFS from './BFS';
import { initialState } from './initialState';

// const initialState = {
//   mapHeight: 0,
//   mapWidth: 0,
//   //1 dimensional array representing the map
//   map: [],

//   player: {
//     //index in map array indicating where the player currently is
//     position: 0,
//     //player's current health
//     hp: 100,
//     //how much the player will damage enemies for.
//     damage: 1,
//   },
//   enemies: [
//     /*
//     {
//       hp: 5,
//       damage: 1,
//       position: index,
//     }
//     */
//   ],
//   log: [],
// };

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.STEP: {
      //shallow copies
      const player = { ...state.player }
      const map = [...state.map]

      //match key pressed to player's displacement
      const keyMap = { 37: -1, 38: -20, 39: 1, 40: 20 }
      const shift = keyMap[action.payload]

      if (map[player.position+shift]==='.') {
             player.position += shift;
             map.splice(player.position,1,'@')
             map.splice(player.position-shift,1,'.')
      }
      return { ...state, player, map }
    }

    case actions.SET_MAP_SIZE: {
      let map = [];
      const dimension = action.height * action.width;
      for (let i = 0; i < dimension; ++i) {
        //place walls on perimeter of the level
        if (
          i % action.width === 0 ||
          (i + 1) % action.width === 0 ||
          i <= action.width ||
          i > (dimension - action.width)
        ) {
          map.push('#');
        } else {
          map.push('.');
        }
      }
      //put player in top-left corner
      map[action.width + 1] = '@';
      let player = Object.assign({}, state.player);
      player.position = action.width + 1;
      return Object.assign({}, state, {
        mapHeight: action.height,
        mapWidth: action.width,
        map,
        player,
      });
    }
    case actions.ADD_ENEMY: {
      let nextMap = state.map.map(value => value);
      let enemies = state.enemies.map(value => value);
      if (nextMap[action.index] !== '@' && nextMap[action.index] !== '#') {
        nextMap[action.index] = 'e';
        enemies.push({
          hp: 5,
          damage: 1,
          position: action.index,
        });
      }
      return { ...state, ...{ map: nextMap, enemies } }
    }
    default: return state;
  }
}

export default reducer;