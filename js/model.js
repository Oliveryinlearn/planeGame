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
        ay = 0
    }) {
        this.vx = vx;
        this.vy = vy;
        this.ax = ax;
        this.ay = ay;
        this.el = null;
        this.width = 0;
        this.height = 0;

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
        console.log(this)
    }
}
/**
 * 敌机
 */
export class Enemy extends Model {
    constructor(game) {
        super({
            game,
            vy: 1
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
    position() {
        //x轴任意位置生成敌机
        this.x = (dom.winW - this.width) * Math.random();
        //y轴的位置刚好放在屏幕外
        this.y = -this.height;
    }
}