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

    rocket: {
      default: null,
      type: cc.Node
    },

    hat: {
      default: null,
      type: cc.Node
    },

    resurrect: {
      default: null,
      type: cc.Node
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    // todo: 美化商店界面按钮
    // todo: 显示当前购买的道具数量
    // todo: Hat和Rocket不能同时购买（且最多只能买一个）（可以参照options）
    this.background.setContentSize(this.node.width, this.node.height)
    /*
     * 开局可购买如下道具
     * 竹蜻蜓、喷气火箭、复活道具
     */
    //this.readLocalWXStorage()

    this.moneyText.string = `money: ${window.money}`
    this.homeButton.on(cc.Node.EventType.TOUCH_END, function (event) {
      cc.director.loadScene('start')
    }, this.homeButton)
    this.rocket.on(cc.Node.EventType.TOUCH_END, function (event) {
      if (window.money >= 200) {
        window.money -= 200
        window.rocketNumber++
        wx.setStorageSync('money', `${window.money}`)
        wx.setStorageSync('rocketNumber', `${window.rocketNumber}`)
      }
    }, this.rocket)
    this.hat.on(cc.Node.EventType.TOUCH_END, function (event) {
      if (window.money >= 100) {
        window.money -= 100
        window.hatNumber++
        wx.setStorageSync('money', `${window.money}`)
        wx.setStorageSync('hatNumber', `${window.hatNumber}`)
      }
    }, this.hat)
    this.resurrect.on(cc.Node.EventType.TOUCH_END, function (event) {
      if (window.money >= 500) {
        window.money -= 500
        window.reviveNumber++
        wx.setStorageSync('money', `${window.money}`)
        wx.setStorageSync('reviveNumber', `${window.reviveNumber}`)
      }
    }, this.resurrect)


  },

  

  start () {

  },

  update (dt) {
    this.moneyText.string = `money: ${window.money}`
  }
})
