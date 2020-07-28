const util = {
    /**
     * 
     * @param {*} el dom元素
     * cssText：cssText 的本质就是设置 HTML 元素的 style 属性值。
     */
    setCssPoints(el) {
        let {
            translateX: x,
            translateY: y
        } = el;
        //设置dom的translateX和translateY
        el.style.cssText = `transform: perspective(500px) matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, ${x}, ${y}, 0, 1);`;
    },

    elPointTransform(el, type) {
        let prop = `translate${type.toLocaleUpperCase()}`;
        let _this = this;
        el[prop] = 0;
        let config = Object.create(null);
        config.get = function () {
            return this[prop]
        }
        config.set = function (val) {
            this[prop] = val;
            _this.setCssPoints(this)
        }
        Object.defineProperty(el, type, config);
    },
    instancePointTransform(el, type) {
        let config = Object.create(null);
        config.get = function () {
            return this.el[type];
        }
        config.set = function (val) {
            this.el[type] = val;
        }
        Object.defineProperty(el, type, config);
    }
}
export default util;