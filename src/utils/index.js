export const keyMap = { 37: -1, 38: -20, 39: 1, 40: 20 }
export const compassMap = {37: 'west', 38: 'north', 39: 'east', 40: 'south'}


export const initialState = {
    mapHeight: 0,
    mapWidth: 0,
    //1 dimensional array representing the map
    map: [],
  
    player: {
      //index in map array indicating where the player currently is
      position: 0,
      //player's current health
      hp: 100,
      //how much the player will damage enemies for.
      damage: 1,
    },
    enemies: [
      /*
      {
        hp: 5,
        damage: 1,
        position: index,
      }
      */
    ],
    log: [],
    playerHistory:[],
  };