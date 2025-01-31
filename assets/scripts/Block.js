cc.Class({
  extends: cc.Component,

  properties: {

    Radius: 15,
    setspeed: 0,
    setspeed_bed: 0,
    speedy: 0,
    game: null,
    type: null,
    acc: 0,
    Duration: 0,
    movedistance: 50,
    maxspeedx: 0,
    sc: 0,
    speedx: 0,
    originx: 0,
    originy: 0,
    downspeed: 0,
    margin: 20,
    first: true,
    hat: null,
    bed: null,
    protection: null

  },

  moveDown: function () {
    return
    // this.node.y=this.node.y-100;
    // var speed=this.game.player.getComponent('Player').speedy;
    // this.speedy=-250;//downspeed;
    this.game.getComponent('Game').speed_block = 250// downspeed;
    return
  },

  onLoad: function () {
    cc.game.on('move-down', this.moveDown, this)
    // this.setspeed=120;
    this.setspeed_bed = 1200
  },
  setmoveAction: function () {
    // 跳跃上升
    var moveright = cc.moveBy(this.Duration, cc.v2(this.movedistance, 0)).easing(cc.easeCubicActionOut())
    // 下落
    var moveleft = cc.moveBy(this.Duration, cc.v2(-this.movedistance, 0)).easing(cc.easeCubicActionIn())
    // 添加一个回调函数，用于在动作结束时调用我们定义的其他方法
    // var callback = cc.callFunc(this.playJumpSound, this);
    // 不断重复，而且每次完成落地动作后调用回调来播放声音
    return cc.repeatForever(cc.sequence(moveleft, moveright))
  },

  start () {
    this.Radius = 15
    this.speedy = 0
    this.setspeed = 700
    this.acc = 50
    this.Duration = 0.1
    this.maxspeedx = 7 * Math.random() + 3
    this.sc = 17 * Math.random() + 8
    this.speedx = this.maxspeedx
    this.accx = -this.maxaccx
    this.downspeed = 250
    this.originx = this.node.x
  },

  touched: function () {
    var player = this.game.player
    if (player.getComponent('Player').alive === false) return false
    if ((Math.abs(player.y - this.node.y - this.node.height - 0.5 * player.height) <= this.Radius) &&

    ((player.x + 0.5 * player.width >= this.node.x + this.margin) && (player.x - 0.5 * player.width <= this.node.x + this.node.width - this.margin))) {
      if (player.getComponent('Player').speedy <= 0) return true
    }
    return false
  },
  touched_protection: function () {
    var player = this.game.player
    if (player.getComponent('Player').alive === false) return false
    if (((player.y - this.node.y - this.node.height - 0.5 * player.height <= 0) && (this.node.y - player.y + 0.5 * player.height <= 0)) &&

    ((player.x + 0.5 * player.width >= this.node.x + this.Radius) && (player.x - 0.5 * player.width <= this.node.x + this.node.width - this.Radius))) {
      return true
    }
    return false
  },

  touched_hat: function () {
    if (this.hat === null) return false
    var player = this.game.player
    if (player.getComponent('Player').alive === false) return false
    if (((player.y - this.node.y - this.node.height - this.hat.height - 0.5 * player.height <= 0) && (this.node.y - player.y - 0.5 * player.height <= 0)) &&
    (player.x + 0.5 * player.width >= this.node.x + this.margin) && (player.x - 0.5 * player.width <= this.node.x + this.node.width - this.margin)) { return true }

    return false
  },
  touched_rocket: function () {
    if (this.rocket === null) return false
    var player = this.game.player
    if (player.getComponent('Player').alive === false) return false
    if (((player.y - this.node.y - this.node.height - this.rocket.height - 0.5 * player.height <= 0) && (this.node.y - player.y - 0.5 * player.height <= 0)) &&
    (player.x + 0.5 * player.width >= this.node.x + this.margin) && (player.x - 0.5 * player.width <= this.node.x + this.node.width - this.margin)) { return true }

    return false
  },

  touched_bed: function () {
    if (this.bed === null) return false
    var player = this.game.player
    if (player.getComponent('Player').alive === false) return false
    if (((player.y - this.node.y - this.node.height - this.bed.height - 0.5 * player.height <= 0) && (this.node.y - player.y - 0.5 * player.height <= 0)) &&
    (player.x + 0.5 * player.width >= this.node.x + this.margin) && (player.x - 0.5 * player.width <= this.node.x + this.node.width - this.margin)) {
      if (player.getComponent('Player').speedy < 0) return true
    }

    return false
  },

  update: function (dt) {
    // if (this.game.player.getComponent('Player').normal===true) this.speedy=0;
    if (-this.game.getComponent('Game').maxY > this.node.y + this.node.height) {
      // if (this.originy>this.game.getComponent('Game').line)
      // this.game.getComponent('Game').line=this.originy;
      this.node.destroy()
      if (this.type === 'hat') { this.hat.destroy() }
      if (this.type === 'bed') { this.bed.destroy() }
      if (this.type === 'rocket') { this.rocket.destroy() }
      if (this.type === 'protection') { this.protection.destroy() }
      return
    }

    if (this.type === 'hat') {
      if (this.touched_hat()) {
        this.game.player.getComponent('Player').setSpeedy(this.setspeed / 2)
        if (this.game.player.getComponent('Player').onhat === false) {
          // this.game.player.getComponent('Player').play_jumpsound();
          this.game.player.getComponent('Player').play_hatsound()
        }

        this.game.player.getComponent('Player').onhat = true
        this.game.player.getComponent('Player').hatdis = 0
        this.hat.destroy()
        this.type = 'basic'
        this.game.player.getComponent('Player').onrocket = false
        cc.audioEngine.stop(this.game.player.getComponent('Player').rocketsound)

        return
      }
    }
    if (this.type === 'rocket') {
      if (this.touched_rocket()) {
        this.game.player.getComponent('Player').setSpeedy(this.setspeed * 2)
        if (this.game.player.getComponent('Player').onrocket === false) {
          // this.game.player.getComponent('Player').play_jumpsound();
          this.game.player.getComponent('Player').play_rocketsound()
        }

        this.game.player.getComponent('Player').onrocket = true
        this.game.player.getComponent('Player').rocketdis = 0
        this.rocket.destroy()
        this.type = 'basic'
        this.game.player.getComponent('Player').onbed = false
        cc.audioEngine.stop(this.game.player.getComponent('Player').hatsound)

        return
      }
    }

    if (this.type === 'protection') {
      if (this.touched_protection()) {
        if ((this.game.player.getComponent('Player').onhat === false) && (this.game.player.getComponent('Player').onrocket === false)) {
          this.game.player.getComponent('Player').setSpeedy(this.setspeed)
          this.game.player.getComponent('Player').play_jumpsound()
        }
        this.game.player.getComponent('Player').protected = true
        this.game.player.getComponent('Player').protected_time = 0
        this.protection.destroy()
        this.type = 'basic'
        this.game.player.getComponent('Player').protected_time = 0
        return
      }
    }

    if ((this.touched_bed()) && (this.type === 'bed')) {
      this.game.player.getComponent('Player').rotate()
      this.game.player.getComponent('Player').setSpeedy(this.setspeed_bed)
      this.game.player.getComponent('Player').play_bedsound()
    }

    if (this.touched() && ((this.type === 'basic') || (this.type === 'leftright'))) {
      if ((this.game.player.getComponent('Player').onhat === false) && (this.game.player.getComponent('Player').onrocket === false)) {
        this.game.player.getComponent('Player').setSpeedy(this.setspeed)
        this.game.player.getComponent('Player').play_jumpsound()
      }
      return
    }

    if (this.touched() && (this.type === 'once')) {
      if ((this.game.player.getComponent('Player').onhat === false) && (this.game.player.getComponent('Player').onrocket === false)) {
        this.game.player.getComponent('Player').setSpeedy(this.setspeed)
        this.game.player.getComponent('Player').play_jumpsound()
        this.node.destroy()
      }
      return
    }

    // this.speedy=this.speedy+this.acc*dt;
    // if (this.speedy>0) this.speedy=0;
    this.speedy = 0
    this.node.y = this.node.y + this.speedy * dt + this.game.getComponent('Game').speed * dt

    if (this.type === 'leftright') {
      this.node.x = this.node.x + this.speedx
      this.accx = (this.originx - this.node.x) / this.sc
      this.speedx = this.speedx + this.accx * dt
    }

    if (this.type === 'hat') {
      this.hat.y = this.hat.y + this.speedy * dt + this.game.getComponent('Game').speed * dt
    }
    if (this.type === 'rocket') {
      this.rocket.y = this.rocket.y + this.speedy * dt + this.game.getComponent('Game').speed * dt
    }
    if (this.type === 'protection') {
      this.protection.y = this.protection.y + this.speedy * dt + this.game.getComponent('Game').speed * dt
    }
    if (this.type === 'bed') {
      this.bed.y = this.bed.y + this.speedy * dt + this.game.getComponent('Game').speed * dt
    }
  }
})
