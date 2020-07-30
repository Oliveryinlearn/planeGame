const template = {
    //飞机
    plane: `<div class="plane"></div>`,
    //敌机1
    enemy_1: `<div class="enemy_1"></div>`,
    //敌机2
    enemy_2: `<div class="enemy_2"></div>`,
    //开始布局
    game_statart: `
        <div class="game_start">
            <img class="logo" src="./images/logo.png">
            <div  class="processing"></div>
            <div class="btn">开始游戏</div>
        </div>
    `,
    // 子弹
    bullet: `<div class="bullet"></div>`,
    // 计分板
    score: `
        <div class="fraction">
            <span>分数:</span>
            <span class="count">0</span>
            <span class="fix count_effect">0</span>
        </div>`
}
export default template;