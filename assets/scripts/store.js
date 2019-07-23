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
    homeButton: {
      default: null,
      type: cc.Node
    },

    background: {
      default: null,
      type: cc.Node
    },

    moneyText: {
      default: null,
      type: cc.Label
    },

    rocketNumber: 0,
    hatNumber: 0,
    reviveNumber: 5
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    /*
     * todo: 开局可购买如下道具
     * 竹蜻蜓、喷漆火箭、复活道具
     */
    this.homeButton.on(cc.Node.EventType.TOUCH_END, function (event) {
      cc.director.loadScene('start')
    })
  },

  start () {
    this.moneyText.string = `money: ${window.money}`
  },

  update (dt) {
    // todo: 改为仅在开始时和购买后更新金钱数量，降低计算负担
    this.moneyText.string = `money: ${window.money}`
  }
})
