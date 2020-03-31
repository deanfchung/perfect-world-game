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

  export const BFS = (start, destination, map, width, height) => {
    let frontier = [start];
    let cameFrom = {};
    cameFrom[start] = -1;
  
    const getNeighbors = (current) => {
      let validNeighbors = [];
      const north = current - width;
      const east = current + 1;
      const south = current + width;
      const west = current - 1;
      if (north > 0 &&( map[north] === '.' || map[north] === '@')) {
        validNeighbors.push(north);
      }
      if ((east + 1) % width !== 0 && (map[east] === '.' || map[east] === '@')) {
        validNeighbors.push(east);
      }
      if (south < width * height && (map[south] === '.' || map[south] === '@')) {
        validNeighbors.push(south);
      }
      if (west % width !== 0 && (map[west] === '.' || map[west] === '@')) {
        validNeighbors.push(west);
      }
      return validNeighbors;
    }
  
    while (frontier.length !== 0) {
      const current = frontier.shift();
      if(current === destination)
        break;
      const neighbors = getNeighbors(current);
      neighbors
        .filter(n => !cameFrom.hasOwnProperty(n))
        .forEach(n => {
          cameFrom[n] = current;
          frontier.push(n);
      });
    }
  
    let current = destination;
    let path = [];
    while(current !== start) {
      path.push(current);
      current = cameFrom[current];
    }
  
    return path.reverse();
  }