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
    },

    maxLocalScore: 0
  },

  load_subpackage: function () {
    cc.loader.downloader.loadSubpackage('block', function (err) {
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
  },

  // LIFE-CYCLE CALLBACKS:

  onLoad: function () {
    // this.load_subpackage();
    // todo: 美化按钮点击后效果
    window.player_type = 'jungle' // 游戏地图初始化
    // 设置适配模式
    this.background.setContentSize(this.node.width, this.node.height)
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

    this.modeChoose.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
      this.opacity = 200 // 反馈效果：拖动物体时变透明
      const delta = event.getDelta()
      if (this.x + delta.x > 320 && this.x + delta.x < 2240) {
        this.x += delta.x
      }
      event.stopPropagation()
    }, this.modeChoose)

    this.modeChoose.on(cc.Node.EventType.TOUCH_END, function (event) {
      this.opacity = 255 // 不再拖动时复原
      const pos = this.x // 更新游戏地图
      // todo: 自动移动并对齐到当前地图
      if (pos <= 640) {
        window.player_type = 'underwater'
      } else if (pos >= 1920) {
        window.player_type = 'default'
      } else if (pos <= 1280) {
        window.player_type = 'jungle'
      } else {
        window.player_type = 'winter'
      }
      // console.log(`Game background switched to ${window.player_type}.`)
      event.stopPropagation()
    }, this.modeChoose)

    this.storeButton.on(cc.Node.EventType.TOUCH_END, function (event) {
      cc.director.loadScene('store')
    }, this.storeButton)

    this.scoreButton.on(cc.Node.EventType.TOUCH_END, function (event) {
      cc.director.loadScene('highScores')
      event.stopPropagation()
    }, this.scoreButton)
  },

  start () {
    this.initUserInfoButton()
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
    if (window.shouldUpdateScore) {
      if (window.score > this.maxLocalScore) {
        this.maxLocalScore = window.score
        wx.postMessage({
          command: 'upload', // 上传分数
          score: window.score
        })
      }
    }
    window.shouldUpdateScore = false
  }
})
