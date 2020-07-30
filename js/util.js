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
    },
    //get：get语法将对象属性绑定到查询该属性时将被调用的函数
    get isMobile() {
        const reg = /(iPhone|iPoad|Andorid|ios)/i;
        if (window.navigator.userAgent.match(reg)) {
            return true;
        } else {
            return false;
        }
    },
    /**
     * 防抖函数，在wait时间内fn只允许触发一次
     * @param {f} fn 函数
     * @param {*} wait 触发间隔
     * @param {*} context this
     */
    throttle(fn, wait, context) {
        let timer;
        return function () {
            if (!timer) {
                timer = setTimeout(() => {
                    timer = null;
                }, wait)
                return fn.apply(context)
            }
        }
    },
    /**
     * 判断目标个敌机是否重合
     * @param {*} target 目标
     * @param {*} enemy 重合
     */
    isCollision(target, enemy) {
        /**
         * 
         */
        return !(target.x + target.width < enemy.x || enemy.x + enemy.width < target.x || target.y + target.height < enemy.y || enemy.y + enemy.height < target.y);
    },
    updateUrl(url, key = "t") {
        let newKey = key + "=";
        let reg = new RegExp(newKey + "\\d+");
        let timestamp = +new Date();
        //如果有这个字段，也就是有t=，那么就代表存在时间戳，直接返回更新
        if (url.indexOf(newKey) > -1) {
            return url.replace(reg, newKey + timestamp);
        }
        //没有这个字段，那么就加上时间戳
        else {
            //判断url中是否有？号，有问好的代表该地址已经包含了参数
            if (url.indexOf("?") > -1) {
                //使用字符串“？”对URL进行分割
                let urlArr = url.split("?");
                //如果？号后面存在参数
                if (urlArr[1]) {
                    return urlArr[0] + "?" + newKey + timestamp + "&" + urlArr[1];
                } else {
                    return urlArr[0] + "?" + newKey + timestamp
                }
            } else {
                //存在#代表存在hash值
                if (url.indexOf("#") > -1) {
                    return url.split("#")[0] + "?" + newKey + timestamp + location.hash;
                } else {
                    return url + "?" + newKey + timestamp;
                }
            }
        }
    }
}
export default util;