import dom from "./dom.js";
import template from "./template.js";
import Music from "./music.js";
import util from "./util.js";

class Model {
    constructor({
        game,
        vx = 0,
        vy = 0,
        ax = 0,
        ay = 0,
        name
    }) {
        this.vx = vx;
        this.vy = vy;
        this.ax = ax;
        this.ay = ay;
        this.el = null;
        this.width = 0;
        this.height = 0;
        this.game = game;
        this.name = name;
    }
    render(tpl) {
        let el = dom.create(tpl);
        dom.insert(el);
        this.setProps(el)
    }
    /**
     * 
     * @param {*} el dom
     * 为dom添加基础属性，并且添加上x属性和y属性
     */
    setProps(el) {
        this.el = el;
        this.width = el._width;
        this.height = el._height;

        util.instancePointTransform(this, "x");
        util.instancePointTransform(this, "y");
    }
    remove() {
        this.el.remove()
    }
    /**
     * 
     * @param {*} type 飞机类型
     */
    explosion(type) {
        //判断是否传入了类型，主要是区分敌机类型
        let extra = type ? `_${type}` : "";
        let effect = `${this.name+extra}_effect`;
        this.el.classList.add(effect);
    }
}
/**
 * 我方飞机
 */
export class Plane extends Model {
    constructor(game) {
        super({
            game,
            //我方飞机的x轴的移动速度
            vx: 5,
            //我方飞机y轴的移动速度
            vy: 5,
            name: "plane"
        });
        //生成我方飞机
        this.render(template.plane);
        //调整我方飞机位置
        this.position();
        //初始化方向
        this.setKeySwitch();
        //绑定按键事件
        this.bindEvent();
        //初始化音乐
        this.initMusic();
        //初始化移动
        this.startTimer();
        //发射子弹
        this.launchBullet = util.throttle(function () {
            let bullet = new Bullet(game, this);
            this.game.bulletGroup.push(bullet);
        }, 200, this);
    }
    position() {
        this.x = (dom.winW - this.width) / 2;
        this.y = dom.winH - this.height;
    }
    /**
     * 初始化按键
     */
    setKeySwitch() {
        this.key_left = false;
        this.key_top = false;
        this.key_right = false;
        this.key_bottom = false;
    }
    /**
     * 绑定按键事件
     */
    bindEvent() {
        document.addEventListener("keydown", e => {
            switch (e.keyCode) {
                //空格
                case 32:
                    this.launchBullet();
                    break;
                    //up键
                case 38:
                    this.key_top = true;
                    break;
                    //down键
                case 40:
                    this.key_down = true;
                    break;
                    //left键
                case 37:
                    this.key_left = true;
                    break;
                    //right键
                case 39:
                    this.key_right = true;
                    break;
                default:
                    console.log("无效案件，请使用上、下、左、右控制")
            }
        })
        document.addEventListener("keyup", e => {
            switch (e.keyCode) {
                //up键
                case 38:
                    this.key_top = false;
                    break;
                    //down键
                case 40:
                    this.key_down = false;
                    break;
                    //left键
                case 37:
                    this.key_left = false;
                    break;
                    //right键
                case 39:
                    this.key_right = false;
                    break;
            }
        })
        /**
         * 检测是否是手机
         */
        if (util.isMobile) {
            this.el.addEventListener("touchmove", e => {
                console.log(e)
            })
        }
    }
    /**
     * 初始化音乐
     */
    // 初始化音乐
    initMusic() {
        this.music = new Music("bullet");
    }
    /**
     * 控制我方飞机移动
     */
    move() {
        if (this.key_top && this.y > 0) {
            this.y -= this.vy;
        }
        if (this.key_down && this.y + this.height < dom.winH) {
            this.y += this.vy
        }
        if (this.key_left && this.x > 0) {
            this.x -= this.vx;
        }
        if (this.key_right && this.x + this.width < dom.winW) {
            this.x += this.vx;
        }
    }
    /**
     * 初始化移动
     * 分为
     */
    startTimer() {
        this.moveTimer = () => {
            this.move();
            requestAnimationFrame(this.moveTimer);
        }
        this.moveTimer();
    }

}
/**
 * 敌机
 */
export class Enemy extends Model {
    constructor(game) {
        super({
            game,
            //敌机的纵向移动速度
            vy: 1,
            name: "enemy"
        });
        this.enemyType = this.createType()
        super.render(template[`enemy_${this.enemyType}`]);
        this.position();
    }
    /**
     * 返回随机数
     */
    createType() {
        let random = Math.round(Math.random() * 10);
        return random < 5 ? 1 : 2;
    }
    /**
     * 敌机的位置在x轴想随机生成，但是在y轴上正好在屏幕外
     */
    position() {
        //x轴任意位置生成敌机
        this.x = (dom.winW - this.width) * Math.random();
        //y轴的位置刚好放在屏幕外
        this.y = -this.height;
    }
    move() {
        //敌机的加速度
        let av = this.enemyType === 1 ? 0 : 0.5;
        this.y += this.vy + av;
    }
}
/**
 * 子弹
 */
export class Bullet extends Model {
    constructor(game, plane) {
        super({
            game,
            vy: 5,
            ay: 0.5,

            name: "bullet"
        });
        //初始化子弹
        this.render(template.bullet);
        //初始化位置
        this.position(plane);
    }
    position(plane) {
        let {
            x,
            y
        } = plane.el;
        this.x = x + plane.width / 2 - 2;
        this.y = y;
    }
    move() {
        this.vy += this.ay;
        this.y -= this.vy;
    }
}