import * as actions from './actions';
import BFS from './BFS';
import { initialState } from './initialState';
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.STEP: {
      //shallow copies
      const player = { ...state.player }
      const map = [...state.map]
      const enemies = [...state.enemies]

      //match key pressed to player's displacement
      const keyMap = { 37: -1, 38: -20, 39: 1, 40: 20 }
      const shift = keyMap[action.payload]

      if (map[player.position+shift]==='.') {
             player.position += shift;
             map[player.position] = '@';
             map[player.position-shift] = '.'
      }

      if (enemies.length) {
      enemies.forEach(enemy => {
        //calculate enemy's next position
        let oldPosition = enemy.position
        enemy.position = BFS(oldPosition, player.position, map, 20, 10)[0]
        //update position on map
        map[oldPosition] = '.';
        map[enemy.position] = 'e';
      })
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