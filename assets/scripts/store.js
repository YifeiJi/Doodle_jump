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
    this.readLocalWXStorage()

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

  readLocalWXStorage: function () {
    // 从本地读取剩余金钱
    const money = wx.getStorageSync('money')
    if (money === '') {
      window.money = 10000 // 如果未定义，则初始化
      console.log('本地微信 money 缓存数据为空。')
      wx.setStorageSync('money', `${window.money}`)
    } else {
      window.money = parseInt(money, 10)
    }

    // 从本地读取剩余rocketNumber
    const rocketNumber = wx.getStorageSync('rocketNumber')
    if (rocketNumber === '') {
      window.rocketNumber = 0 // 如果未定义，则初始化
      console.log('本地微信 rocketNumber 缓存数据为空。')
      wx.setStorageSync('rocketNumber', `${window.rocketNumber}`)
    } else {
      window.rocketNumber = parseInt(rocketNumber, 10)
    }

    // 从本地读取剩余hatNumber
    const hatNumber = wx.getStorageSync('hatNumber')
    if (hatNumber === '') {
      window.hatNumber = 0 // 如果未定义，则初始化
      console.log('本地微信 hatNumber 缓存数据为空。')
      wx.setStorageSync('hatNumber', `${window.hatNumber}`)
    } else {
      window.hatNumber = parseInt(hatNumber, 10)
    }

    // 从本地读取剩余reviveNumber
    const reviveNumber = wx.getStorageSync('reviveNumber')
    if (reviveNumber === '') {
      window.reviveNumber = 0 // 如果未定义，则初始化
      console.log('本地微信 reviveNumber 缓存数据为空。')
      wx.setStorageSync('reviveNumber', `${window.reviveNumber}`)
    } else {
      window.reviveNumber = parseInt(reviveNumber, 10)
    }
  },

  start () {

  },

  update (dt) {
    this.moneyText.string = `money: ${window.money}`
  }
})
