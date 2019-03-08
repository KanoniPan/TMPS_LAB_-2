interface IWorldMap {
  create(x: number,y: number): void;
}

class WorldMapProxy implements IWorldMap {
  private resource: WorldMap;

  constructor() {
    this.resource = new WorldMap();
  }

  create(x: number,y: number): void {
    this.checkAccess();
    this.resource.create(x,y);
  }
  private checkAccess(): boolean {
    console.log('collecting resources....');
    return true;
  }

}

class WorldMap implements IWorldMap {
  create(x: number,y: number): void {
    console.log(`creating world map with size: [${x},${y}]`)
  }
}
class Terain {
  generateTerain(x: number, y:number, quantity: number) {
    let arrayOfTerain = [];
    for (let i=0; i < quantity; i ++) {
      let randomTerain = Math.floor(Math.random() * (x-y) +y);
      if(arrayOfTerain.includes(randomTerain)) {
        randomTerain = Math.floor(Math.random() * (x-y) +y);
        arrayOfTerain.push(randomTerain);
        console.log(`generating random terain on possitions: ${randomTerain}`);
      } else {
        arrayOfTerain.push(randomTerain);
        console.log(`generating random terain on possitions: ${randomTerain}`);
      }
    }
    return arrayOfTerain;  
  }
  
}

class Rocks {
  generateRocks(x:number, y: number,quantity: number) {
    let arrayOfRocks = []
    for (let i=0; i < quantity; i ++) {
      let randomRock = Math.floor(Math.random() * (x-y) +y);
      if(arrayOfRocks.includes(randomRock)) {
        randomRock = Math.floor(Math.random() * (x-y) +y);
        arrayOfRocks.push(randomRock);
        console.log(`generating random rocks on possitions: ${randomRock}`);
      } else {
        arrayOfRocks.push(randomRock);
        console.log(`generating random rocks on possitions: ${randomRock}`);
      }
    }
    return arrayOfRocks;
  }
}

class Trees {
  generateTrees(x:number, y: number,quantity: number) {
    let arrayOfTrees = [];
    for(let i=0; i < quantity; i++) {
    let randomTree = Math.floor(Math.random() * (x-y) +y);
    if(arrayOfTrees.includes(randomTree)) {
      randomTree = Math.floor(Math.random() * (x-y) +y);
      arrayOfTrees.push(randomTree)
      console.log(`generating random trees on possition: ${randomTree}`)
    } else {
      arrayOfTrees.push(randomTree)
      console.log(`generating random trees on possition: ${randomTree}`)
    }
    
    }
    return arrayOfTrees;
    // console.log(`~~~`,arrayOfTrees)
  }
}

class PopulateWorld {
  private _terain: Terain;
  private _rocks: Rocks;
  private _trees: Trees;
  constructor() {
    this._terain = new Terain();
    this._rocks = new Rocks();
    this._trees = new Trees();
  }
  populateWorld(x,y,terain,rocks,trees) {
    this._terain.generateTerain(x,y,terain);
    this._rocks.generateRocks(x,y,rocks);
    this._trees.generateTrees(x,y,trees);
  }
}

class Commander {
  constructor(private actionObject: Action, private target: string, private location: [number, number]) {
  }

  order(order: string): string {
    this.actionObject.attack(this.target,this.location);
    return order;
  }
}

class UpgradedProtossCommander extends Commander {
  specificOrder(specificOrder: string): string {
    console.log(`Upgraded Protoss commander make order ${specificOrder}`)
    super.order(specificOrder);
    return specificOrder;
  }
}

class ProtossCommander extends Commander {
  order(order: string): string {
    console.log(`Protoss commander make order ${order}`)
    super.order(order);
    return order;
  }
}

class Adapter extends ProtossCommander {
  private upgradedProtossCommander: UpgradedProtossCommander
  constructor(upgradedProtossCommander: UpgradedProtossCommander) {
    super(UpgradedProtoss.getProtos('upgraded-set', 2), 'queen', [10,7]);
    this.upgradedProtossCommander = upgradedProtossCommander;
  }

  public order(order: string): string {
    const result = this.upgradedProtossCommander.specificOrder(order).split('').reverse().join('');
    console.log(`Adapter: (TRANSLATED) ${result}`) ;
    return result;
  }
}

interface Action {
  move(location: [number, number]): void;
  attack?(target: string, location: [number, number]): void;
}

class Protoss implements Action {

  private equipmentSet: string;
  number: number;

  constructor(set: string, number: number) {
    this.equipmentSet = set;
    this.number = number;
    console.log(`new protoss ${number}`);
  }

  move(location: [number, number]): void {
    console.log(`move to ${location}`)
  }

  attack?(target: string, location: [number, number]): void {
    console.log(`damage ${target} at ${location}`);
  }

}

class UpgradedProtoss {
  private static groups: { [set: string]: Protoss } = {}

  public static getProtos(set: string, num: number) {
    let protoss = UpgradedProtoss.groups[set];

    if (!protoss) {
      protoss = new Protoss(set, num);
      UpgradedProtoss.groups[set] = protoss;
    } else {
      protoss.number = num;
      console.log(`shared protoss ${protoss.number}`);
    }

    return protoss;
  }
}

(function main() {
  let x = 100;
  let y = 250;
  let rocksQuantity = 15;
  let treesQuantity = 10;
  let terrainQuantity = 200;
  const proxy = new WorldMapProxy();
  proxy.create(100,250);
  const populatedWorld = new PopulateWorld();
  populatedWorld.populateWorld(x,y,terrainQuantity,rocksQuantity,treesQuantity);

  const commanderA = new ProtossCommander(new Protoss('normal-set',1), 'zergling', [5,5]);
  const commanderB = new Adapter(new UpgradedProtossCommander(UpgradedProtoss.getProtos('upgraded-set', 2), 'queen', [10,7]));
  commanderA.order('attack!');
  commanderB.order('!!!kcatta');
  const start = Math.floor(Date.now());
  for (let i = 0; i < 1000000; i++) {
    // new Protoss('normal-set', i); // create 1m real soldiers
    UpgradedProtoss.getProtos('normal-set', i); // create 1 protoss
    let protoss = new Protoss('normal-set', i);
    protoss.move([i,i])
    protoss.attack('zergiling',[10,10])
  }
  const end = Math.floor(Date.now());
  console.log(end - start);

})()