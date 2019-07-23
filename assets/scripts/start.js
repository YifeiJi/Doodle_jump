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

    maxScore: 0,
    finalScore: 0,
    shouldUpdateScore: false

  },


  load_subpackage: function () {

    cc.loader.downloader.loadSubpackage('block', function (err) {
      if (err) {
        return console.error(err);
      }
    });


    cc.loader.downloader.loadSubpackage('player', function (err) {
      if (err) {
        return console.error(err);
      }
    });
    cc.loader.downloader.loadSubpackage('monster', function (err) {
      if (err) {
        return console.error(err);
      }
    });
  },



  // LIFE-CYCLE CALLBACKS:

  onLoad: function () {
    //this.load_subpackage();
    this.bg.setContentSize(this.node.width, this.node.height)
    window.player_type = 'winter' // 游戏地图初始化
    window.money = 10000 // 金钱初始化
    //window.level = 'easy'
    //window.sensibility = 'medium'
    this.playButton.on(cc.Node.EventType.TOUCH_END, function (event) {
      cc.director.loadScene('game')
      event.stopPropagation()
    }, this.playButton)

    this.scoreButton.on(cc.Node.EventType.TOUCH_END, function (event) {
      cc.director.loadScene('highScores')
      event.stopPropagation()
    }, this.scoreButton),
      this.optionButton.on(cc.Node.EventType.TOUCH_END, function (event) {
        cc.director.loadScene('option')
        event.stopPropagation()
      }, this.scoreButton)
    // cc.game.addPersistRootNode(this.node)

    this.modeChoose.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
      this.opacity = 200 // 反馈效果：拖动物体时变透明
      const delta = event.getDelta()
      if (this.x + delta.x > -664 && this.x + delta.x < 618) {
        this.x += delta.x
      }
      event.stopPropagation()
    }, this.modeChoose)

    this.modeChoose.on(cc.Node.EventType.TOUCH_END, function (event) {
      this.opacity = 255 // 不再拖动时复原
      const pos = this.x // 更新游戏地图
      // todo: 自动移动并对齐到当前地图
      if (pos <= -350) {
        window.player_type = 'jungle'
      } else if (pos >= 290) {
        window.player_type = 'underwater' // todo: 试玩发现死亡后没有终止界面
      } else {
        window.player_type = 'winter'
      }
      //console.log(`Game background switched to ${window.player_type}.`)
      event.stopPropagation()
    }, this.modeChoose)

    this.storeButton.on(cc.Node.EventType.TOUCH_END, function (event) {
      cc.director.loadScene('store')
    }, this.storeButton)
  },

  start() {

  },

  update(dt) {
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
