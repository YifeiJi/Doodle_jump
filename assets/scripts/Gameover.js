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
    }

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
    var score = window.score
    this.scoreDisplay.string = '<color=#222222>Your score:  ' + parseInt(score) + '</n>'
  }

  // update (dt) {},
})
