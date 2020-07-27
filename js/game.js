import dom from "./dom.js";
import template from "./template.js";

class Game{
    constructor(){
        console.log(1)
        //初始化UI界面
        this._initUI();
    }
    _initUI(){
        let el = dom.create(template.game_statart)
        //  console.log(el)
        dom.insert(el)
       

    }
}
export default Game;