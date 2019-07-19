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
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    this.playButton.on(cc.Node.EventType.TOUCH_END, function (event) {
      cc.director.loadScene('start')
    })
  },

  start () {
    window.wx.postMessage({
      command: 'open' // 绘制分数排行榜
    })
    const openDataContext = window.wx.getOpenDataContext()
    const sharedCanvas = openDataContext.canvas

    const canvas = window.nwx.createCanvas()
    const context = canvas.getContext('2d')
    context.drawImage(sharedCanvas, 0, 0)
  }

  // update (dt) {},
})
