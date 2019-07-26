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
    maxX: 0,
    maxY: 0,
    restartButton: {
      default: null,
      type: cc.Node
    },

    menuButton: {
      default: null,
      type: cc.Node
    },
    scoreDisplay: {
      default: null,
      type: cc.RichText
    },
    maxLocalScore: 0
    // foo: {
    //     // ATTRIBUTES:
    //     default: null,        // The default value will be used only when the component attaching
    //                           // to a node for the first time
    //     type: cc.SpriteFrame, // optional, default is typeof default
    //     serializable: true,   // optional, default is true
    // },
    // bar: {
    //     get () {
    //         return this._bar;
    //     },
    //     set (value) {
    //         this._bar = value;
    //     }
    // },
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    console.log('gameover')
    this.maxX = this.node.width / 2
    this.maxY = this.node.height / 2
    this.restartButton.on(cc.Node.EventType.TOUCH_END, function (event) {
      cc.director.loadScene('game')
    })
    this.menuButton.on(cc.Node.EventType.TOUCH_END, function (event) {
      cc.director.loadScene('start')
    })
  },

  start () {
    this.bg.setContentSize(2 * this.maxX, 2 * this.maxY)
    window.score = parseInt(window.score)
    var score = window.score
    // window.reviveNumber = 0
    window.hatNumber = 0
    window.rocketNumber = 0
    // console.log('money')
    // console.log(window.money)

    wx.setStorageSync('reviveNumber', `${window.reviveNumber}`)

    wx.setStorageSync('rocketNumber', `${0}`)
    wx.setStorageSync('hatNumber', `${0}`)
    wx.setStorageSync('money', `${window.money + 50}`)
    window.start_with_rocket = false
    window.start_with_hat = false

    wx.postMessage({
      command: 'upload', // 上传分数
      score: window.score
    })

    this.scoreDisplay.string = '<color=#222222>Your score:  ' + parseInt(score) + '</n>'
  }

  // update (dt) {},
})
