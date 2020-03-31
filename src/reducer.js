import * as actions from './actions';
import BFS from './BFS';
import { initialState } from './initialState';
import { movePlayer, keyMap, compassMap, attackEnemy } from './utils';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.STEP: {
      //shallow copies
      const player = { ...state.player }
      const map = [...state.map]
      let enemies = [...state.enemies]
      const log = [...state.log]
      const playerHistory = [...state.playerHistory]
      const prevPosition = playerHistory[playerHistory.length-1]
      let enemyHistory = []
      let subEnemyHistory = [];
      let newPlayerPosition = player.position;
      console.log('enemyHistory', state.enemyHistory)

      //match key pressed to player's displacement
      const shift = keyMap[action.keyCode]

      //player moves to empty space
      if (map[player.position + shift] === '.') {
        newPlayerPosition = player.position + shift
        map[newPlayerPosition] = '@';
        map[player.position] = '.';
        log.push('player moved ' + `${compassMap[action.keyCode]}`)
      }

      //player attacks enemy

      //if any enemies still exist, enemie(s) move and/or attack player
      if (enemies.length) {
        enemies.forEach((enemy,i) => {
          console.log('calculations iteration: ', i);
          //calculate enemy's next position
          let oldPosition = enemy.position
          let calculation = BFS(oldPosition, newPlayerPosition, map, 20, 10)
          calculation.length > 2 ? subEnemyHistory.push({i: calculation.slice(0,2)}) : subEnemyHistory.push({i: calculation})
          let newPosition = BFS(oldPosition, newPlayerPosition, map, 20, 10)[0]
 
          //console.log('newPosition', newPosition)
          const wasAdjacent = () => {
            if (oldPosition-1===prevPosition || oldPosition+1===prevPosition || oldPosition + 20 === prevPosition || oldPosition-20===prevPosition) {
              return true;
            }
            return false;
          }
          //if player was previously adjacent, enemy stays in place for turn but deals damage
          if (wasAdjacent()) {
            console.log('was previously adjacent');
            player.hp-=enemy.damage;
            log.push(`enemy ${i} attacked player`)
          }

          //if new position is unoccupied and was not previously adjacent, move forward
           if (map[newPosition] === '.' && !wasAdjacent()) {
            enemy.position = newPosition;
            map[oldPosition] = '.';
            map[enemy.position] = 'e';
          }

        })
      }
        enemyHistory.push(subEnemyHistory);
        playerHistory.push(newPlayerPosition);
        player.position = newPlayerPosition;
        return { ...state, player, map, enemies, log, playerHistory, enemyHistory }
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