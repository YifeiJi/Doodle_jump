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
        if (res.KVDataList.length > 0) { // 如果云端已有分数，先比较（否则直接上传）
          console.log(`云端存档分数为 ${res.KVDataList[0].value}`)
          cloudScore = parseInt(res.KVDataList[0].value, 10)
          if (score <= cloudScore) {
            console.log('当前用户分数不大于云端分数，不必上传')
            return
          }
        }

        wx.setUserCloudStorage({
          KVDataList: [
            { key: 'maxScore', value: score.toString() }
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
    // 由于微信小游戏内存回收机制存在严重问题，因此需要检测之前生成的prefab是否已被销毁
    if (this.scrollViewContent.children.length) {
      console.log('当前存在未回收的prefab，排行榜不再重新绘制', this.scrollViewContent.children)
      return
    }
    this.rankingScrollView.node.active = true

    // 接口废弃：为了将当前用户加入排行榜，需要手动处理
    // this.initUserInfo()
    // this.initFriendInfo()
    console.log('网不好')
    wx.getUserInfo({
      openIdList: ['selfOpenId'],
      lang: 'zh_CN',
      success: (res) => {
        this.loadingLabel.active = false
        // const myData = res.data[0]
        // this.createUserBlock('user', res.data[0])
        console.log('当前用户信息获取成功', res.data[0])
        wx.getFriendCloudStorage({
          keyList: ['maxScore'],
          success: (res) => {
            const friendData = res.data
            if (friendData.length > 0) {
              console.log(`玩过这个游戏的好友还有：${friendData[0].nickname}等${friendData.length}人`)
            }

            /*
            // 传入自己的数据，一同加入排名
             * wx.getFriendCloudStorage已经包含用户自身分数，不需要再处理
            let myKVDataList = []
            wx.getUserCloudStorage({
              keyList: ['maxScore'],
              success: res => {
                myKVDataList = res.KVDataList
                console.log('从getUserCloudStorage接口获取的用户信息如下', res.KVDataList)
              }
            })
            friendData.push({
              avatarUrl: myData.avatarUrl,
              nickname: myData.nickName,
              KVDataList: myKVDataList
            })
             */

            /* 一些自定义的测试用样例数据
            friendData.push({
              nickname: '王二麻子',
              KVDataList: [
                { key: 'maxScore', value: '8' }
              ]
            })
            friendData.push({
              nickname: '李四',
              KVDataList: [
                { key: 'maxScore', value: '123' }
              ]
            })
            friendData.push({
              nickname: '张三',
              KVDataList: [
                { key: 'maxScore', value: '666' }
              ]
            })
             */

            // 把用户所有好友的分数降序重新排列后依次绘制
            this.scoreSort(friendData)
            console.log(friendData)
            for (let i = 0; i < friendData.length; i++) {
              this.createUserBlock(i, friendData[i]) // 这里的i+1就是排名
            }
          },
          fail: (res) => {
            console.error(res)
          }
        })
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
    if (user.avatarUrl) {
      cc.loader.load({ url: user.avatarUrl, type: 'png' }, (err, texture) => {
        if (err) {
          console.error(err)
        }
        const userIcon = node.getChildByName('avatarImgSprite').getComponent(cc.Sprite)
        userIcon.spriteFrame = new cc.SpriteFrame(texture)
      })
    }

    // set rank
    const userRank = node.getChildByName('rankLabel').getComponent(cc.Label)
    if (rank === 'user') {
      userRank.string = 'me'
    } else {
      if (rank === 0) {
        node.getChildByName('rankLabel').setScale(2)
      } else if (rank === 1) {
        node.getChildByName('rankLabel').setScale(1.6)
      } else if (rank === 2) {
        node.getChildByName('rankLabel').setScale(1.3)
      }
      userRank.string = (rank + 1).toString()
    }

    // set score
    const userScore = node.getChildByName('topScoreLabel').getComponent(cc.Label)
    if (rank === 'user') {
      wx.getUserCloudStorage({ // OpenDataContext-wx.getUserInfo不包含用户分数，需要单独获取
        keyList: ['maxScore'],
        success: res => {
          if (res.KVDataList.length > 0) { // 有云端分数就用云端分数和本地分数中最大值
            const cloudScore = parseInt(res.KVDataList[0].value, 10)
            userScore.string = (cloudScore > this.localMaxScore) ? cloudScore : this.localMaxScore
          } else { // 否则就用本地分数
            userScore.string = this.localMaxScore ? this.localMaxScore.toString() : '0'
          }
        },
        fail: function () {
          console.log('获取用户云端分数记录失败')
          userScore.string = this.localMaxScore ? this.localMaxScore.toString() : '0'
        }
      })
    } else {
      if (user.KVDataList.length > 0) {
        userScore.string = user.KVDataList[0].value
      } else { // 如果有好友玩过但是没有上传分数，则默认记为0分
        userScore.string = 0
      }
    }
  },

  scoreSort (data) {
    data.sort((a, b) => {
      if (a.KVDataList.length === 0 && b.KVDataList.length === 0) {
        return 0
      }
      if (a.KVDataList.length === 0) {
        return 1
      }
      if (b.KVDataList.length === 0) {
        return -1
      }
      return parseInt(b.KVDataList[0].value) - parseInt(a.KVDataList[0].value)
    })
  },

  onDestroy () {
    this.scrollViewContent.removeAllChildren()
    wx.triggerGC()
  }

  // update (dt) {},
})
