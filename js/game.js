import dom from "./dom.js";
import template from "./template.js";
import Music from "./music.js";
import util from "./util.js";
import Score from "./score.js";

import {
    Enemy,
    Plane
} from "./model.js";

class Game {
    constructor() {
        this.bzMusic = null; //爆炸音乐
        this.bgMusic = null; //背景音乐
        this.enemyGroup = []; //存储敌机的组
        this.enemyTime = null; //定时器，生成敌机
        this.plane = null; //我方飞机
        this.moveTimer = null; //定时器，子弹/敌机
        this.bulletGroup = []; //子弹组
        this.background = document.body; // 游戏背景
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
        this.startEnemy();
        //初始化我方飞机
        this.plane = new Plane(this);
        //初始化记分板
        this.score = new Score();
        /**
         * 敌机开始移动
         * 
         */
        this.startMove();
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
    startEnemy() {
        let createEnemy = () => {
            let enemy = new Enemy();
            this.enemyGroup.push(enemy);
        }
        createEnemy();
        this.enemyTime = setInterval(createEnemy, 1500);
    }
    /**
     * 开启监听移动
     */
    startMove() {
        this.moveTimer = () => {
            //碰撞检测
            this.detectCollision();
            //敌机移动
            this.elementMove();
            requestAnimationFrame(this.moveTimer);
        }
        this.moveTimer()
    }
    /**
     * 模型移动
     */
    elementMove() {
        //敌机移动
        this.enemyGroup.forEach((el, index, enemys) => {
            let isExceed = el.y >= dom.winH;
            if (isExceed) {
                el.remove();
                enemys.splice(index, 0)
            } else {
                el.move()
            }
        })
        //子弹移动
        this.bulletGroup.forEach((el, index, bullets) => {
            let isExceed = el.y + el.height <= 0;
            if (isExceed) {
                el.remove();
                bullets.splice(index, 1);
            } else {
                el.move();
            }
        })
        // 背景移动
        this.background.style.backgroundPosition = `left 0 top -${(this.bgPosYCount += 0.5)}px`;
    }
    /**
     * 碰撞检测
     */
    detectCollision() {
        //敌机与我方飞机
        this.enemyGroup.forEach((enemy, index, enemys) => {
            //检测是否有碰撞
            let isCollision = util.isCollision(this.plane, enemy);
            if (isCollision) {
                new Promise((y) => {
                    //获取敌机类型
                    let enemyType = enemy.enemyType;
                    //爆炸音效启动
                    this.bzMusic && this.bzMusic.play();
                    //启动飞机爆炸效果
                    this.plane.explosion();
                    //敌机爆炸
                    enemy.explosion(enemyType);
                    //移除敌机实例
                    enemys.splice(index, 1);
                    setTimeout(y, 450);
                }).then(() => {
                    //移除我方飞机
                    this.plane.remove();
                    //移除敌方飞机
                    enemy.remove();
                    //结束游戏
                    this.end()
                })
            }
        })
        //子弹与敌机碰撞
        this.bulletGroup.forEach((bullet, i, bullets) => {
            this.enemyGroup.forEach((enemy, j, enemys) => {
                //检测是否有碰撞
                let isCollision = util.isCollision(bullet, enemy);
                if (isCollision) {
                    new Promise((y) => {
                        //获取敌机类型
                        let enemyType = enemy.enemyType;
                        //爆炸音效启动
                        this.bzMusic && this.bzMusic.play();
                        //启动飞机爆炸效果
                        bullet.explosion();
                        //敌机爆炸
                        enemy.explosion(enemyType);
                        // 更新分数
                        this.score.update(enemyType);
                        //子弹爆炸
                        bullet.explosion();
                        //移除子弹实例
                        bullets.splice(i, 1);
                        //移除敌机实例
                        enemys.splice(j, 1);
                        setTimeout(y, 450);
                    }).then(() => {
                        //移除子弹
                        bullet.remove();
                        //移除敌方飞机
                        enemy.remove();
                        // 移除计分板效果类
                        this.score.removeEffect();
                    })
                }
            })
        })
    }
    /**
     * 结束游戏
     */
    end() {
        setTimeout(() => {
            alert("游戏结束");
            window.location.href = util.updateUrl(window.location.href);
            // util.updateUrl()
        }, 500)
    }
}
export default Game;