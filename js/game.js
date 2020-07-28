import dom from "./dom.js";
import template from "./template.js";
import Music from "./music.js";
import {
    Enemy
} from "./model.js";

class Game {
    constructor() {
        this.bzMusic = null;
        this.bgMusic = null;
        this.enemyGroup =[];
        this.enemyTime=null;
        //初始化UI界面
        this._initUI();
    }
    _initUI() {
        /**
         * 启动页并加入DOM
         */
        let el = dom.create(template.game_statart)
        dom.insert(el)
        /**
         * 点击开始按钮
         */
        let btn = el.querySelector(".btn");
        btn.addEventListener("click", () => {
            //启动游戏
            this.start()
            //删除启动页
            el.remove();

            //释放元素
            el = null;
            btn = null;
        })
    }
    /**
     * 启动游戏
     */
    start() {
        //初始化音乐
        this.initMusic();
        //初始化敌机;
        this.startEnemy()
    }
    /**
     * 初始化游戏音乐
     */
    initMusic() {
        this.bzMusic = new Music("explosion");
        this.bgMusic = new Music("game_bg");
        this.bgMusic.audio.autoplay = true;
        this.bgMusic.audio.loop = true;
    }
    /**
     * 初始化敌机
     */
    startEnemy(){
        let createEnemy=()=>{
            let enemy = new Enemy();
            this.enemyGroup.push(enemy);
        }
        createEnemy();
        this.enemyTime=setInterval(createEnemy,1500);
    }
}
export default Game;