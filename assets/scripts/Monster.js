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
    timer: 0,
    speedy: 0,
    acc: 0,
    setspeed: 0,
    setspeed_2: 0,
    Radius: 5,
    game: null,
    type: 'default',
    speedx: 0,
    sc: 0,
    accx: 0,
    margin: 25,
    maxspeedx: 0
  },

  touched_bottom: function () {
    var player = this.game.player
    // if (((player.y-this.node.y-this.node.height<=this.Radius)&&(this.node.y-player.y-player.height<=this.Radius))&&

    // (player.x+player.width>=this.node.x+this.Radius)&&(player.x<=this.node.x+this.node.width-this.Radius))
    if ((Math.abs(this.node.y - 0.5 * player.height - player.y) <= this.Radius) &&

            (player.x + 0.5 * player.width >= this.node.x + this.margin) && (player.x - 0.5 * player.width <= this.node.x + this.node.width - this.margin)) { if (player.getComponent('Player').speedy >= 0) return true}
    return false
  },
  touched_top: function () {
    var player = this.game.player
    // if (((player.y-this.node.y-this.node.height<=this.Radius)&&(this.node.y-player.y-player.height<=this.Radius))&&

    // (player.x+player.width>=this.node.x+this.Radius)&&(player.x<=this.node.x+this.node.width-this.Radius))
    if ((Math.abs(player.y - 0.5 * player.height - (this.node.y + this.node.height)) <= this.Radius) &&

            (player.x + 0.5 * player.width >= this.node.x) && (player.x - 0.5 * player.width <= this.node.x + this.node.width)) { if (player.getComponent('Player').speedy < 0) return true}
    return false
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad () {
    this.acc = 50
  },

  start () {
    this.maxspeedx = 3 * Math.random() + 3
    this.speedx = this.maxspeedx
    this.sc = 30 * Math.random() + 10
    this.timer = 0
    this.setspeed = -1000
    this.setspeed_2 = 500
    var self = this
    cc.loader.loadRes('monster_00', cc.SpriteFrame, function (err, spriteFrame) {
      self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame
    })
  },

  update (dt) {
    var self = this

    if (this.type === 'move') {
      this.node.x = this.node.x + this.speedx
      this.accx = (this.originx - this.node.x) / this.sc
      this.speedx = this.speedx + this.accx * dt
    }

    if ((this.touched_bottom()) && (this.game.player.getComponent('Player').protected === false)) {
      this.game.player.getComponent('Player').setSpeedy(this.setspeed)
      this.game.player.getComponent('Player').alive = false
      this.game.player.getComponent('Player').play_dropsound()
    }
    if ((this.touched_top()) && (this.game.player.getComponent('Player').alive === true)) {
      this.game.player.getComponent('Player').setSpeedy(this.setspeed_2)
      this.game.player.getComponent('Player').jump_dropsound()
    }

    this.timer += 1
    if (this.type === 'move') {
      if (this.timer % 3 === 0) {
        cc.loader.loadRes('monster_00', cc.SpriteFrame, function (err, spriteFrame) {
          self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame
        })
      } else if (this.timer % 3 === 1) {
        cc.loader.loadRes('monster_01', cc.SpriteFrame, function (err, spriteFrame) {
          self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame
        })
      } else if (this.timer % 3 === 2) {
        cc.loader.loadRes('monster_02', cc.SpriteFrame, function (err, spriteFrame) {
          self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame
        })
      }
    }

    if (this.type !== 'move') {
      if (this.timer % 3 === 0) {
        cc.loader.loadRes('monster_01', cc.SpriteFrame, function (err, spriteFrame) {
          self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame
        })
      } else if (this.timer % 3 === 1) {
        cc.loader.loadRes('monster_00', cc.SpriteFrame, function (err, spriteFrame) {
          self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame
        })
      } else if (this.timer % 3 === 2) {
        cc.loader.loadRes('monster_01', cc.SpriteFrame, function (err, spriteFrame) {
          self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame
        })
      }
    }

    this.speedy = this.speedy + this.acc * dt
    if (this.speedy > 0) this.speedy = 0

    if (this.game.player.getComponent('Player').alive === true) this.node.y = this.speedy * dt + this.node.y + this.game.getComponent('Game').speed * dt
  }
})
