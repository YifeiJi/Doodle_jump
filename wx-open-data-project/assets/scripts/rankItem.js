cc.Class({
  extends: cc.Component,
  name: 'RankItem',
  properties: {
    rankLabel: cc.Label,
    avatarImgSprite: cc.Sprite,
    nickLabel: cc.Label,
    topScoreLabel: cc.Label
  },
  start () {

  },

  init: function (rank, data) {
    const avatarUrl = data.avatarUrl
    // let nick = data.nickname.length <= 10 ? data.nickname : data.nickname.substr(0, 10) + "...";
    const nick = data.nickname
    const grade = data.KVDataList.length !== 0 ? data.KVDataList[0].value : 0

    if (rank % 2 === 0) {
      this.backSprite.color = new cc.Color(55, 55, 55, 255)
    }

    if (rank === 0) {
      this.rankLabel.node.color = new cc.Color(255, 0, 0, 255)
      this.rankLabel.node.setScale(2)
    } else if (rank === 1) {
      this.rankLabel.node.color = new cc.Color(255, 255, 0, 255)
      this.rankLabel.node.setScale(1.6)
    } else if (rank === 2) {
      this.rankLabel.node.color = new cc.Color(100, 255, 0, 255)
      this.rankLabel.node.setScale(1.3)
    }
    this.rankLabel.string = (rank + 1).toString()
    this.createImage(avatarUrl)
    this.nickLabel.string = nick
    this.topScoreLabel.string = grade.toString()
  },

  createImage (avatarUrl) {
    try {
      const image = wx.createImage()
      image.onload = () => {
        try {
          const texture = new cc.Texture2D()
          texture.initWithElement(image)
          texture.handleLoadedTexture()
          this.avatarImgSprite.spriteFrame = new cc.SpriteFrame(texture)
        } catch (e) {
          cc.log(e)
          this.avatarImgSprite.node.active = false
        }
      }
      image.src = avatarUrl
    } catch (e) {
      cc.log(e)
      this.avatarImgSprite.node.active = false
    }
  }

})
