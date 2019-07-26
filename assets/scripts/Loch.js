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
    scalerate: 0.99,
    margin: 20,
    meetonce: false
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

  // onLoad () {},

  start () {

  },
  meet: function () {
    var player = this.game.player
    if (this.meetonce === true) return true
    if (player.y + player.height / 2 <= this.node.y) return false
    if (player.y - player.height / 2 >= this.node.y + this.node.height) return false
    if (player.x + player.width / 2 <= this.node.x + this.margin) return false
    if (player.x - player.width / 2 >= this.node.x + this.node.width - this.margin) return false
    return true
  },

  update (dt) {
    if (-this.game.getComponent('Game').maxY > this.node.y + this.node.height) {
      this.node.destroy()
      return
    }

    if (this.meet()) {
      if (this.meetonce === false) { this.game.player.getComponent('Player').rotate_() }
      this.meetonce = true
      var player = this.game.player
      player.getComponent('Player').setscale(this.scalerate)
      var speedy = (this.node.y + this.node.height / 2 - (player.y)) * 20
      var speedx = (this.node.x + this.node.width / 2 - (player.x)) * 20
      player.getComponent('Player').setSpeedy(speedy)
      player.getComponent('Player').setSpeedx(speedx)
    }
    this.node.y = this.node.y + this.game.getComponent('Game').speed * dt
  }
})
