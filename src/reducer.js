import * as actions from './actions';
import { keyMap, compassMap, initialState, BFS, movePlayer, wasAdjacent } from './utils';

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actions.STEP: {
      const player = { ...state.player }
      const map = [...state.map]
      let enemies = [...state.enemies]
      const log = [...state.log]
      let newPlayerPosition = player.position;

      //match key pressed to player's displacement
      const shift = keyMap[action.keyCode]

      //player moves to empty space
      if (map[player.position + shift] === '.') {
        newPlayerPosition = player.position + shift
        movePlayer(map, newPlayerPosition, player.position, log, compassMap, action.keyCode)
      }

      //player attacks enemy
      if (map[player.position + shift] === 'e') {
        let engagedEnemy;
        enemies.forEach((enemy, i) => {
          if (enemy.position === player.position + shift) {
            engagedEnemy = i;
          }
        })
        let enemy = enemies[engagedEnemy];
        enemy.hp -= player.damage;
        log.push('player attacked enemy')
        if (enemy.hp === 0) {
          map[enemy.position] = '.'
          if (enemies.length > 1) {
            enemies = enemies.filter(el => el !== enemy)
          }
          else {
            newPlayerPosition = enemy.position;
            movePlayer(map, newPlayerPosition, player.position, log, compassMap, action.keyCode)
            enemies = [];
          }
        }
      }
      const playerHistory = [...state.playerHistory]
      const prevPosition = playerHistory[playerHistory.length - 1]
      //if any enemies still exist, move and/or attack player
      if (enemies.length) {
        enemies.forEach((enemy, i) => {
          //calculate enemy's next position
          let oldPosition = enemy.position
          let newPosition = BFS(oldPosition, newPlayerPosition, map, 20, 10)[0]

          //if player was previously adjacent, enemy stays in place for turn but deals damage
          if (wasAdjacent(oldPosition, prevPosition)) {
            player.hp -= enemy.damage;
            log.push('enemy attacked player')
          }

          //if new position is unoccupied and was not previously adjacent, move toward player
          if (map[newPosition] === '.' && !wasAdjacent(oldPosition, prevPosition)) {
            enemy.position = newPosition;
            map[oldPosition] = '.';
            map[enemy.position] = 'e';
          }
        })
      }
      playerHistory.push(newPlayerPosition);
      player.position = newPlayerPosition;
      return { ...state, player, map, enemies, log, playerHistory }
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