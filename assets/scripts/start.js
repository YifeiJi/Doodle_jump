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
    background: {
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
    optionButton: {
      default: null,
      type: cc.Node
    },

    storeButton: {
      default: null,
      type: cc.Node
    },

    modeChoose: {
      default: null,
      type: cc.Node
    }

  },

  load_subpackage: function () {
    cc.loader.downloader.loadSubpackage('block', function (err) {
      if (err) {
        return console.error(err)
      }
    })
    cc.loader.downloader.loadSubpackage('game', function (err) {
      if (err) {
        return console.error(err)
      }
    })

    cc.loader.downloader.loadSubpackage('player', function (err) {
      if (err) {
        return console.error(err)
      }
    })
    cc.loader.downloader.loadSubpackage('monster', function (err) {
      if (err) {
        return console.error(err)
      }
    })
    cc.loader.downloader.loadSubpackage('store', function (err) {
      if (err) {
        return console.error(err)
      }
    })
    cc.loader.downloader.loadSubpackage('highScores', function (err) {
      if (err) {
        return console.error(err)
      }
    })
  },

  // LIFE-CYCLE CALLBACKS:

  readLocalWXStorage: function () {
    // 从本地读取剩余金钱
    const money = wx.getStorageSync('money')
    if (money === '') {
      window.money = 1000 // 如果未定义，则初始化
      console.log('本地微信 money 缓存数据为空。')
      wx.setStorageSync('money', `${window.money}`)
    } else {
      window.money = parseInt(money, 10)
    }
  },
  onLoad: function () {
    if (window.loaded !== true) {
      this.load_subpackage()
      window.loaded = true
    }
    // todo: 美化按钮点击后效果
    window.player_type = 'default' // 游戏地图初始化
    // 设置适配模式

    this.background.setContentSize(this.node.width, this.node.height)
    this.modeChoose.setContentSize(this.node.width * 4, 120)
    this.modeChoose.x = -this.node.width * 0.5
    cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT)
    // window.level = 'easy'
    // window.sensibility = 'medium'
    this.playButton.on(cc.Node.EventType.TOUCH_END, function (event) {
      cc.director.loadScene('game')
      event.stopPropagation()
    }, this.playButton)

    this.optionButton.on(cc.Node.EventType.TOUCH_END, function (event) {
      cc.director.loadScene('option')
      event.stopPropagation()
    }, this.scoreButton)
    // cc.game.addPersistRootNode(this.node)
    var self = this
    this.modeChoose.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
      this.opacity = 200 // 反馈效果：拖动物体时变透明
      const delta = event.getDelta()
      if ((this.x + delta.x >= -self.node.width * 4.5) && (this.x + delta.x < -self.node.width * 0.5)) {
        this.x += delta.x
        if (Math.abs(this.x + self.node.width * 3.5) <= 40) this.x = -self.node.width * 3.5
        if (Math.abs(this.x + self.node.width * 2.5) <= 40) this.x = -self.node.width * 2.5
        if (Math.abs(this.x + self.node.width * 1.5) <= 40) this.x = -self.node.width * 1.5
        if (Math.abs(this.x + self.node.width * 0.5) <= 40) this.x = -self.node.width * 0.5
      }
      event.stopPropagation()
    }, this.modeChoose)

    this.modeChoose.on(cc.Node.EventType.TOUCH_END, function (event) {
      this.opacity = 255 // 不再拖动时复原
      const pos = this.x // 更新游戏地图
      // todo: 自动移动并对齐到当前地图
      // var position=pos/this.node.width;

      if (pos <= -self.node.width * 3.5) {
        window.player_type = 'underwater'
      } else if (pos <= -self.node.width * 2.5) {
        window.player_type = 'jungle'
      } else if (pos <= -self.node.width * 1.5) {
        window.player_type = 'winter'
      } else {
        window.player_type = 'default'
      }
      // console.log(`Game background switched to ${window.player_type}.`)
      event.stopPropagation()
    }, this.modeChoose)

    this.storeButton.on(cc.Node.EventType.TOUCH_END, function (event) {
      cc.director.loadScene('store')
    }, this.storeButton)
    this.x = this.x + this.node.width
    this.scoreButton.on(cc.Node.EventType.TOUCH_END, function (event) {
      cc.director.loadScene('highScores')
      event.stopPropagation()
    }, this.scoreButton)
  },

  start () {
    // this.initUserInfoButton()
    // this.readLocalWXStorage()
  },

  initUserInfoButton () {
    if (typeof wx === 'undefined') {
      return
    }

    wx.getSetting({
      success (res) {
        if (!res.authSetting['scope.userInfo']) { // 如果用户尚未授权，则请求授权
          const systemInfo = wx.getSystemInfoSync()
          const width = systemInfo.windowWidth
          const height = systemInfo.windowHeight
          const button = wx.createUserInfoButton({
            type: 'text',
            text: '',
            style: {
              left: 0,
              top: 0,
              width: width,
              height: height,
              lineHeight: 40,
              backgroundColor: '#00000000',
              color: '#00000000',
              textAlign: 'center',
              fontSize: 10,
              borderRadius: 4
            }
          })

          button.onTap((res) => {
            const userInfo = res.userInfo
            if (!userInfo) {
              return
            }
            button.hide()
            button.destroy()
          })
        }
      }
    })
  },

  update (dt) {
    /*
    if (window.shouldUpdateScore) {
      if (window.score > this.maxLocalScore) {
        this.maxLocalScore = window.score
        wx.postMessage({
          command: 'upload', // 上传分数
          score: window.score
        })
      }
    } */
    window.shouldUpdateScore = false
  }
})
