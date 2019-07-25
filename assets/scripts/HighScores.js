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
    }
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    this.background.setContentSize(this.node.width, this.node.height)

    this.homeButton.on(cc.Node.EventType.TOUCH_END, function (event) {
      cc.director.loadScene('start')
    })
  },

  start () {
    
    wx.postMessage({
      command: 'open' // 绘制分数排行榜
    })
    
  }
  /* update (dt) {
   * 理论上当开放数据域被唤起后，只要 WXSubContextView 组件 load 成功，开放数据域贴图就开始更新到主域并显示，之后每帧都会更新贴图。
  },
   */
})
