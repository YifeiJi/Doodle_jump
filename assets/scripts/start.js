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
  prepared:false,
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
    pos: 0,
    loaded:false

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
    
    console.log('a'+money+'b')
    if (money === '') {
      window.money = 1000 // 如果未定义，则初始化
      console.log('本地微信 money 缓存数据为空。')
      wx.setStorageSync('money', `${window.money}`)
    } else {
      window.money = parseInt(money, 10)
    }


    // 从本地读取剩余rocketNumber
    const rocketNumber = wx.getStorageSync('rocketNumber')
    if (rocketNumber === '') {
      window.rocketNumber = 0 // 如果未定义，则初始化
      console.log('本地微信 rocketNumber 缓存数据为空。')
      wx.setStorageSync('rocketNumber', `${window.rocketNumber}`)
    } else {
      window.rocketNumber = parseInt(rocketNumber, 10)
    }

    const hatNumber = wx.getStorageSync('hatNumber')
    if (hatNumber === '') {
      window.hatNumber = 0 // 如果未定义，则初始化
      console.log('本地微信 hatNumber 缓存数据为空。')
      wx.setStorageSync('hatNumber', `${window.hatNumber}`)
    } else {
      window.hatNumber = parseInt(hatNumber, 10)
    }

    const reviveNumber = wx.getStorageSync('reviveNumber')
    if (reviveNumber === '') {
      window.reviveNumber = 0 // 如果未定义，则初始化
      console.log('本地微信 reviveNumber 缓存数据为空。')
      wx.setStorageSync('reviveNumber', `${window.reviveNumber}`)
    } else {
      window.reviveNumber = parseInt(reviveNumber, 10)
    }



  },
  getURL: function (url) {
    url = cc.url.raw(url);
    if (cc.loader.md5Pipe) {
      url = cc.loader.md5Pipe.transformURL(url);
    }
    try {
      let fs = wx.getFileSystemManager();
      let localPath = wx.env.USER_DATA_PATH + '/';
      url = localPath + url;
      fs.accessSync(url);
    }
    catch (error) {
      url = window.wxDownloader.REMOTE_SERVER_ROOT + "/" + url;
    }
    return url;
  },


  onLoad: function () {
    this.load_subpackage();
    this.loaded=false;
    //this.initUserInfoButton()
    /*
    if (window.loaded !== true) {
      this.load_subpackage();
      window.loaded = true;
    }*/

  
    /*
    wx.showShareMenu();
    var sharePicUrl

    cc.loader.loadRes('share', (err, data) => {
      if (err) {
        console.log('获取图片地址错误');
      } else {
        //sharePicUrl = data.url;
        sharePicUrl = cc.loader.md5Pipe.transformURL(data.url);
        console.log(sharePicUrl);
      }
    });


    if (typeof (wx) !== "undefined") {
      wx.onShareAppMessage(() => {
        return {
          title: "Let's play Doodle jump!",
          imageUrl: sharePicUrl
          // this.getURL('resources/player/default/origin_left')
        }
      })

    }

*/

    // todo: 美化按钮点击后效果
    window.player_type = 'default' // 游戏地图初始化
    // 设置适配模式

    this.background.setContentSize(this.node.width, this.node.height)
    this.modeChoose.setContentSize(this.node.width * 4, 120)
    this.modeChoose.x = -this.node.width * 0.5
    //cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT)

   
    // cc.game.addPersistRootNode(this.node)
    var self = this
    this.pos = -this.node.width * 0.5
    this.delta = 0
    this.modeChoose.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
      this.opacity = 200 // 反馈效果：拖动物体时变透明
      const delta = event.getDelta()
      this.x += delta.x


      event.stopPropagation()
    }, this.modeChoose)


    this.modeChoose.on(cc.Node.EventType.TOUCH_END, function (event) {
      this.opacity = 255 // 不再拖动时复原


      if (this.x > self.pos) self.delta = 1
      if (this.x < self.pos) self.delta = -1
      this.x = self.pos + self.delta * self.node.width
      if (this.x > -self.node.width * 0.5) this.x = -self.node.width * 3.5
      if (this.x < -self.node.width * 3.5) this.x = -self.node.width * 0.5
      self.pos = this.x
      self.delta = 0
      const pos = this.x // 更新游戏地图
      if (pos === -self.node.width * 3.5) {
        window.player_type = 'underwater'
      } else if (pos === -self.node.width * 2.5) {
        window.player_type = 'jungle'
      } else if (pos === -self.node.width * 1.5) {
        window.player_type = 'winter'
      } else {
        window.player_type = 'default'
      }
      // console.log(`Game background switched to ${window.player_type}.`)
      event.stopPropagation()
    }, this.modeChoose)

   
    //this.x = this.x + this.node.width
   
  },

  start() {
    // cc.director.preloadScene('game', (c,t,i)=>{}, (e,a)=>{})
    // cc.director.preloadScene('option', (c,t,i)=>{}, (e,a)=>{})
    // cc.director.preloadScene('highScores', (c,t,i)=>{}, (e,a)=>{})
    // cc.director.preloadScene('store', (c,t,i)=>{}, (e,a)=>{})
    //cc.director.preloadScene('game', ()=>{})
    //cc.director.preloadScene('option', ()=>{})
    //cc.director.preloadScene('highScores', ()=>{})
    //cc.director.preloadScene('store', ()=>{})
    /*cc.director.preloadScene('game', function () {
      cc.log('Next scene preloaded');
  });
*/
var self=this
/*
cc.director.preloadScene('game', function() {
  self.loaded = true;
})*/
    this.readLocalWXStorage()
   
    this.playButton.on(cc.Node.EventType.TOUCH_END, function (event) {
    
      //if (!self.prepared) return;
     if (!self.loaded)
     return;
      
      cc.director.loadScene('game')
      event.stopPropagation()
   
    }, this)

    this.optionButton.on(cc.Node.EventType.TOUCH_END, function (event) {
      //if (!self.prepared) return;
      cc.director.loadScene('option')

      event.stopPropagation()
     
    }, this)

    this.scoreButton.on(cc.Node.EventType.TOUCH_END, function (event) {
      //if (!self.prepared) return;
      cc.director.loadScene('highScores')
     
      event.stopPropagation()
      
    }, this)

    this.storeButton.on(cc.Node.EventType.TOUCH_END, function (event) {
      //if (!self.prepared) return;
      console.log('store')
      console.log(self.storeButton)
      console.log(cc.director._loadingScene)
      cc.director.loadScene('store')
      
      event.stopPropagation()
      
    }, this)

  },

  initUserInfoButton() {
    if (typeof wx === 'undefined') {
      return
    }
    var self=this
    wx.getSetting({
      success(res) {
        console.log(res.authSetting['scope.userInfo'])
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
            self.prepared=true
            button.hide()
            button.destroy()
          })
        } else {self.prepared=true}
      }
    })
  },

 
})
