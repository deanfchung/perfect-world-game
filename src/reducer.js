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
      const log = [...state.log]

      //match key pressed to player's displacement
      const keyMap = { 37: -1, 38: -20, 39: 1, 40: 20 }
      const compassMap = {37: 'west', 38: 'north', 39: 'east', 40: 'south'}
      const shift = keyMap[action.keyCode]

      //player moves to empty space
      if (map[player.position + shift] === '.') {
        player.position += shift;
        map[player.position] = '@';
        map[player.position - shift] = '.'
        log.push('player moved ' + `${compassMap[action.keyCode]}`)
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
          log.push('enemy died');
          map[enemy.position] = '.'
            engagedEnemy === 0 ? enemies.unshift() : enemies.pop();
        }
      }

      if (enemies[0].hp > 0) {
        enemies.forEach(enemy => {
          //calculate enemy's next position
          let oldPosition = enemy.position
          let newPosition = BFS(oldPosition, player.position, map, 20, 10)[0]

          //enemy moves toward player
          if (map[newPosition] !== '@') {
            enemy.position = newPosition;
            map[oldPosition] = '.';
            map[enemy.position] = 'e';
          }
          //enemy attacks player
          if (map[newPosition]==='@') {
            player.hp -= enemy.damage;
            log.push('enemy attacked player')
          }
        })
      }
        return { ...state, player, map, enemies, log }
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