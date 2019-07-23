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
    },

    rocketNumber: 0,
    hatNumber: 0,
    reviveNumber: 5
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    this.background.setContentSize(this.node.width, this.node.height)
    /*
     * 开局可购买如下道具
     * 竹蜻蜓、喷气火箭、复活道具
     */

    // 从本地读取剩余金钱
    wx.getStorage({
      key: 'money',
      success: res => {
        if (!!res.data) {
          window.money = parseInt(res.data, 10)
        } else {
          window.money = 10000 // 如果未定义，则初始化
        }
      },
      fail () {
        window.money = 0
        console.log('读取本地微信 money 缓存数据失败。')
      }
    })
    this.moneyText.string = `money: ${window.money}`

    this.homeButton.on(cc.Node.EventType.TOUCH_END, function (event) {
      cc.director.loadScene('start')
    }, this.homeButton)

    this.rocket.on(cc.Node.EventType.TOUCH_END, function (event) {
      if (window.money >= 200) {
        window.money -= 200
        this.rocketNumber++
        // 仅在开始时和购买后更新金钱数量（并将当前金钱存储到本地），降低计算负担
        this.moneyText.string = `money: ${window.money}`
        wx.setStorage({
          key: 'money',
          data: `${window.money}`
        })
      }
    }, this.rocket)

    this.hat.on(cc.Node.EventType.TOUCH_END, function (event) {
      if (window.money >= 100) {
        window.money -= 100
        this.hatNumber++
        // 仅在开始时和购买后更新金钱数量（并将当前金钱存储到本地），降低计算负担
        this.moneyText.string = `money: ${window.money}`
        wx.setStorage({
          key: 'money',
          data: `${window.money}`
        })
      }
    }, this.hat)

    this.resurrect.on(cc.Node.EventType.TOUCH_END, function (event) {
      window.money -= 500
      this.reviveNumber++
      // 仅在开始时和购买后更新金钱数量（并将当前金钱存储到本地），降低计算负担
      this.moneyText.string = `money: ${window.money}`
      wx.setStorage({
        key: 'money',
        data: `${window.money}`
      })
    }, this.resurrect)
  },

  start () {
    
  },

  update (dt) {

  }
})
