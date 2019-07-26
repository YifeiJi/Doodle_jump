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

    initialGearPurchase: {
      default: null,
      type: cc.Node
    },

    resurrectPurchase: {
      default: null,
      type: cc.Node
    },

    resurrectNumberLabel: {
      default: null,
      type: cc.Label
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    this.background.setContentSize(this.node.width, this.node.height)
    /*
     * 开局可购买如下道具
     * 竹蜻蜓、喷气火箭、复活道具
     */
    // this.readLocalWXStorage()
    this.init() // 根据当前道具情况更新页面

    this.moneyText.string = `money: ${window.money}`
    this.homeButton.on(cc.Node.EventType.TOUCH_END, function (event) {
      cc.director.loadScene('start')
    }, this.homeButton)

    this.initialGearPurchase.on(cc.Node.EventType.TOUCH_END, function (event) {
      if (!this.getComponent(cc.Button).interactable) {
        console.log('当前已有初始道具，无法再购买。')
        console.log(`window.hatNumber = ${window.hatNumber}`, `window.rocketNumber = ${window.rocketNumber}`)
        return // 只能拥有一件起始道具
      }

      const toggle = this.getChildByName('bornToggleContainer')
      if (toggle.getChildByName('hatButton').getComponent(cc.Toggle).isChecked) {
        if (window.money >= 100) {
          console.log('购买hat成功')
          window.money -= 100
          window.hatNumber++
          this.getComponent(cc.Button).interactable = false
          wx.setStorageSync('money', `${window.money}`)
          wx.setStorageSync('hatNumber', `${window.hatNumber}`)
        }
      } else if (toggle.getChildByName('rocketButton').getComponent(cc.Toggle).isChecked) {
        if (window.money >= 200) {
          console.log('购买rocket')
          window.money -= 200
          window.rocketNumber++
          this.getComponent(cc.Button).interactable = false
          wx.setStorageSync('money', `${window.money}`)
          wx.setStorageSync('rocketNumber', `${window.rocketNumber}`)
        }
      }
    }, this.initialGearPurchase)

    this.resurrectPurchase.on(cc.Node.EventType.TOUCH_END, function (event) {
      if (window.money >= 500) {
        window.money -= 500
        window.reviveNumber++
        wx.setStorageSync('money', `${window.money}`)
        wx.setStorageSync('reviveNumber', `${window.reviveNumber}`)
      }
    }, this.resurrectPurchase)
  },

  readLocalWXStorage: function () {
    // 从本地读取剩余金钱
    const money = wx.getStorageSync('money')
    if (money === '') {
      window.money = 3000 // 如果未定义，则初始化
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

    const hatNumber = wx.getStorageSync('hatNumber')
    if (hatNumber === '') {
      window.hatNumber = 0 // 如果未定义，则初始化
      console.log('本地微信 hatNumber 缓存数据为空。')
      wx.setStorageSync('hatNumber', `${window.rocketNumber}`)
    } else {
      window.hatNumber = parseInt(hatNumber, 10)
    }

    const reviveNumber = wx.getStorageSync('reviveNumber')
    if (reviveNumber === '') {
      window.reviveNumber = 0 // 如果未定义，则初始化
      console.log('本地微信 reviveNumber 缓存数据为空。')
      wx.setStorageSync('reviveNumber', `${window.rocketNumber}`)
    } else {
      window.reviveNumber = parseInt(reviveNumber, 10)
    }
  },

  init () {
    const toggle = this.initialGearPurchase.getChildByName('bornToggleContainer')
    if (window.hatNumber > 0) {
      this.initialGearPurchase.getComponent(cc.Button).interactable = false
      toggle.getChildByName('hatButton').getComponent(cc.Toggle).isChecked = true
    } else if (window.rocketNumber > 0) {
      this.initialGearPurchase.getComponent(cc.Button).interactable = false
      toggle.getChildByName('rocketButton').getComponent(cc.Toggle).isChecked = true
    } else {
      this.initialGearPurchase.getComponent(cc.Button).interactable = true
      toggle.getChildByName('nullButton').getComponent(cc.Toggle).isChecked = true
    }
  },

  start () {

  },

  update (dt) {
    this.moneyText.string = `Balance: ${window.money}`
    this.resurrectNumberLabel.string = `Now you have: ${window.reviveNumber}`
  }
})
