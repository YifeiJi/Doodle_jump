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
    bg: {
      default: null,
      type: cc.Node
    },

    playButton: {
      default: null,
      type: cc.Node
    },

    scoreButton: {
      default: null,
      type: cc.Node
    },

    maxScore: 0,
    finalScore: 0,
    shouldUpdateScore: false

  },

  // LIFE-CYCLE CALLBACKS:

  // todo 采用preload进行优化
  onLoad: function () {
    this.bg.setContentSize(this.node.width, this.node.height)
    this.playButton.on(cc.Node.EventType.TOUCH_END, function (event) {
      cc.director.loadScene('game')
    })
    this.scoreButton.on(cc.Node.EventType.TOUCH_END, function (event) {
      cc.director.loadScene('highScores')
    })
    window.player_type = 'jungle'
    // cc.game.addPersistRootNode(this.node)
  },

  start () {

  },

  update (dt) {
    if (this.shouldUpdateScore) {
      if (this.maxScore < this.finalScore) {
        // 构建发布时指定开放数据域
        window.wx.postMessage({
          command: 'upload', // 上传分数
          score: this.finalScore
        })
        this.maxScore = this.finalScore
      }
      this.shouldUpdateScore = false
    }
  }
})
