// Learn cc.Class:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://docs.cocos2d-x.org/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] https://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        bg: {
            default: null,
            type: cc.Node
        },
        maxX:0,
        maxY:0,
        
          menuButton: {
            default: null,
            type: cc.Node
          },
        

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.maxX = this.node.width / 2;
        this.maxY = this.node.height / 2;
        
        this.menuButton.on(cc.Node.EventType.TOUCH_END, function (event) {
            cc.director.loadScene('start')
          })


    },

    start () {
        this.bg.setContentSize(2 * this.maxX, 2 * this.maxY);
        
    },

    // update (dt) {},
});
