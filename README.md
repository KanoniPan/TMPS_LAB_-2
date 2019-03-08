# TMPS_LAB №2
### Made using TypeScript
*Facade, Flyweight, Bridge, Proxy, Adapter.*
___
It is a laboratory work by number 2, where 5 template have been used. This is a demo version of game, here we firstly create our world, then we populate it with trees,terain and rocks, after we create units, commanders and we can fight with enemies. Below i show examples of code how i used patterns and how they helped me to create a world in which units fight.

* This is `Flyweight`, it is used for creating army of units, first we initialize our interface `Action`, with 2 methods `move` and `attack?`, `attack` is optional
```
interface Action {
  move(location: [number, number]): void;
  attack?(target: string, location: [number, number]): void;
}
```
After i create class Protoss in which i initialize constructor, then i use my 2 methods `move` and `attack` because this unit can kill othters
```
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
```
By this line of code, using loop, i can create an army of Protosses and it will use the same object as before for creating units
```
new Protoss('normal-set', i);
``` 

* This is `Bridge`, here i have my Commander who can give orders to protosses and it is used to order Protosses to attack one target for example
```
class Commander {
  constructor(private actionObject: Action, private target: string, private location: [number, number]) {
  }

  order(order: string): string {
    this.actionObject.attack(this.target,this.location);
    return order;
  }
}
```
To use it we need to create ProtossCommander, because we can have multiple types of Commanders, for air units, terain units and etc.
```
class ProtossCommander extends Commander {
  order(order: string): string {
    console.log(`Protoss commander make order ${order}`)
    super.order(order);
    return order;
  }
}
```
And in code below you can see how `Commander` can give orders to attack targets (before attack we need to give array of units, because if we dont have any we can't command)
```
const commanderA = new ProtossCommander(new Protoss('normal-set',1), 'zergling', [5,5]);

commanderA.order('attack!');
```

* This is my `Adapter`, in it i'm using my `UpgradedProtossCommander`, because it got `specialOrder`, and it should be translated to normal language so units can understand him, so i need to make adapter to transtale orders, in this order, i'm translating order, so units can attack targets more accurate
```
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
```
Usage:
```
const commanderB = new Adapter(new UpgradedProtossCommander(UpgradedProtoss.getProtos('upgraded-set', 2), 'queen', [10,7]));
commanderB.order('!!!kcatta');
```
* This is `Proxy`, proxy is used for creating world for units, it is impossible to fight nowhere, so firstly i have to create world where units can kill each other, firstly i create interface `IWorldMap` and it has `create` method, after i create class `WorldMap` where i create my world, but before using i want to be sure that i have all my resouses, so i create `WorldMapProxy` where i can checkAccess where resourses are collected before usage 
```
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
```
Usage:
```
  let x = 100;
  let y = 250;
  const proxy = new WorldMapProxy();
  proxy.create(100,250);
```
* And my last pattern is `Facade`, i use facade to populate my world with trees, rocks and terain. Below i show an example of terain. So i create class Terain with method `generateTerain` and arguments for `generateTerain` are: `x,y,quantity`, i create an empty array before creating terain on random places (by using this i can check if i have repeating values, so i can rerandom value and push it to my array)
```
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
```

Then i create class `PopulateWorld` with method `populateworld` in which i create my world

```
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
```

Usage of Facade: 
```
  let x = 100;
  let y = 250;
  let rocksQuantity = 15;
  let treesQuantity = 10;
  let terrainQuantity = 200;
  const proxy = new WorldMapProxy();
  proxy.create(100,250);
  const populatedWorld = new PopulateWorld();
  populatedWorld.populateWorld(x,y,terrainQuantity,rocksQuantity,treesQuantity);
```
