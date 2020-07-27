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
    create(tpl){
        this.box.innerHTML = "";
        this.box.innerHTML = tpl;
        console.log(this)
        let el = this.box.firstElementChild;
        return el
    },
    insert(el){
        this.room.appendChild(el);
        /**
         * getBoundingClientRect():返回元素的大小及其相对于视口的位置
         * 这个方法在IE4就开始支持了
         */
        let { width, height } = el.getBoundingClientRect();
        // el._width = width;
        // el._height = height;
        console.log(el)
    }
}
export default dom;
