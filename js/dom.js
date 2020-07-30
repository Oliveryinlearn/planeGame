import util from "./util.js";
const dom = {
    box: document.createElement("div"),
    room: document.body,
    winW: window.innerWidth,
    winH: window.innerHeight,
    /**
     * @param {*} query 选择器字符串 
     */
    getElement(query) {
        return document.querySelector(query);
    },
    getElements(query) {
        return document.querySelectorAll(query);
    },
    /**
     * 
     * @param {*} tpl 初始化的模版
     */
    create(tpl) {
        //因为字符串不是dom，需要先创建
        this.box.innerHTML = "";
        this.box.innerHTML = tpl;
        let el = this.box.firstElementChild;
        util.elPointTransform(el, "x");
        util.elPointTransform(el, "y");
        return el;
    },
    insert(el) {
        this.room.appendChild(el);
        /**
         * getBoundingClientRect():返回元素的大小及其相对于视口的位置
         * 这个方法在IE4就开始支持了
         */
        let {
            width,
            height
        } = el.getBoundingClientRect();
        //给dom添加私有属性
        el._width = width;
        el._height = height;
    }
}
export default dom;