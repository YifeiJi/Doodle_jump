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
    rankingScrollView: {
      default: null,
      type: cc.ScrollView
    },
    scrollViewContent: {
      default: null,
      type: cc.Node
    },
    prefabRankItem: {
      default: null,
      type: cc.Prefab
    },
    loadingLabel: {
      default: null,
      type: cc.Node // 加载文字
    },

    localMaxScore: 0
  },

  // LIFE-CYCLE CALLBACKS:

  // onLoad () {},

  start () {
    if (typeof wx === 'undefined') {
      return
    }

    wx.onMessage(data => {
      switch (data.command) {
        case 'upload': // 上传用户分数
          this.updateUserInfo(parseInt(data.score, 10))
          break
        case 'open': // 绘制排行榜
          this.localMaxScore = parseInt(data.score, 10)
          this.drawRankingList()
          break
      }
    })
  },

  updateUserInfo (score) {
    // 先取得云端分数并比较
    let cloudScore = 0
    wx.getUserCloudStorage({
      keyList: ['maxScore'],
      success: res => {
        cloudScore = parseInt(res.KVDataList[0].value, 10)
        if (score <= cloudScore) {
          console.log('当前用户分数不大于云端分数，不必上传')
          return
        }
        wx.setUserCloudStorage({
          KVDataList: [
            { key: 'maxScore', value: String(score) }
          ],
          success: res => {
            console.log('上传用户最大分数成功！', res)
          },
          fail: res => {
            console.log('上传用户最大分数失败！', res)
          }
        })
      },
      fail: function () {
        console.log('获取用户云端分数记录失败')
      }
    })
  },

  // 绘制排行榜
  drawRankingList () {
    this.rankingScrollView.node.active = true
    this.initUserInfo()
    this.initFriendInfo()
  },

  initUserInfo () {
    wx.getUserInfo({
      openIdList: ['selfOpenId'],
      lang: 'zh_CN',
      success: (res) => {
        this.loadingLabel.active = false
        this.createUserBlock('user', res.data[0])
        console.log('当前用户信息获取成功', res.data[0])
      },
      fail: (res) => {
        console.error(res)
      }
    })
  },

  initFriendInfo () {
    wx.getFriendCloudStorage({
      success: (res) => {
        console.log(`玩过这个游戏的好友还有：${res.data[0].nickname}等${res.data.length}人`)
        // todo: 当前未按照分数排名
        // todo: 把用户和用户所有好友的分数降序重新排列后依次绘制
        for (let i = 0; i < res.data.length; ++i) {
          this.createUserBlock(res.data[i])
        }
      },
      fail: (res) => {
        console.error(res)
      }
    })
  },

  createUserBlock (rank, user) {
    const node = cc.instantiate(this.prefabRankItem)
    this.scrollViewContent.addChild(node)
    // node.parent = this.scrollViewContent
    node.x = 0

    // set nickName
    const userName = node.getChildByName('nickLabel').getComponent(cc.Label)
    const tempName = user.nickName || user.nickname
    userName.string = tempName.length <= 6 ? tempName : tempName.substr(0, 6) + '...'

    // set avatar
    cc.loader.load({ url: user.avatarUrl, type: 'png' }, (err, texture) => {
      if (err) {
        console.error(err)
      }
      const userIcon = node.getChildByName('avatarImgSprite').getComponent(cc.Sprite)
      userIcon.spriteFrame = new cc.SpriteFrame(texture)
    })

    // set rank
    const userRank = node.getChildByName('rankLabel').getComponent(cc.Label)
    if (rank === 0) {
      node.getChildByName('rankLabel').setScale(2)
    } else if (rank === 1) {
      node.getChildByName('rankLabel').setScale(1.6)
    } else if (rank === 2) {
      node.getChildByName('rankLabel').setScale(1.3)
    }
    // todo: 处理共同加入排名的情况
    // userRank.string = (rank + 1).toString()

    // set score
    const userScore = node.getChildByName('topScoreLabel').getComponent(cc.Label)
    if (rank === 'user') {
      wx.getUserCloudStorage({
        keyList: ['maxScore'],
        success: res => {
          userScore.string = res.KVDataList[0].value
        },
        fail: function () {
          console.log('获取用户云端分数记录失败')
          userScore.string = window.score ? window.score : '0'
        }
      })
    } else {
      userScore.string = user.KVDataList[0].value
    }
  },

  scoreSort (scores) {
    scores.sort((a, b) => {
      if (a.KVDataList.length === 0 && b.KVDataList.length === 0) {
        return 0
      }
      if (a.KVDataList.length === 0) {
        return 1
      }
      if (b.KVDataList.length === 0) {
        return -1
      }
      return b.KVDataList[0].value - a.KVDataList[0].value
    })
  }

  // update (dt) {},
})
