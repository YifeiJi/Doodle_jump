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

        timer:0,
        jumpHeight: 0,
        jumpDuration: 0,
        maxMoveSpeed: 0,
        speedx: 0,
        speedy: 0,
        timer: 0,
        // 加速度
        accelx: 0,
        accely: 0,
        hatdis: 0,
        rocketdis: 0,
        protected_time: 0,
        scalerate:1,
        accLeft: false,
        accRight: false,
        onhat: false,
        onrocket: false,
        right: true,
        protected: false,
        alive: true,
        fall:false,
        restart:0,
        left: false,
        pic: 'default',
        path: null,
        hatsound: null,
        rocketsound: null,
        sound:false,
        sensibility:10,
        loaded:false,
        bubble: {
            default: null,
            type: cc.Node
        },
        jump_audio: {
            default: null,
            type: cc.AudioClip
        },
        drop_audio: {
            default: null,
            type: cc.AudioClip
        },
        hat_audio: {
            default: null,
            type: cc.AudioClip
        }, 
        rocket_audio: {
            default: null,
            type: cc.AudioClip
        }, 
        bed_audio: {
            default: null,
            type: cc.AudioClip
        }
    },


    rotate: function () {
        var rotation = cc.rotateBy(0.5, 360);
        this.node.runAction(rotation);
    },
    rotate_: function () {
        var rotation = cc.rotateBy(2, 360);
        this.node.runAction(rotation);
    },
    setSpeedy(value) {

        this.speedy = value;


    },
    setSpeedx(value) {

        this.speedx = value;


    },
    setscale:function(value)
{
this.scalerate=value;

return;
},
    play_jumpsound: function () {
        if (this.sound===false) return;
        cc.audioEngine.play(this.jump_audio, false, 1);
        return;
    },
    play_dropsound: function () {
        if (this.sound===false) return;
        cc.audioEngine.play(this.drop_audio, false, 1);
        return;
    },
    play_hatsound: function () {
        if (this.sound===false) return;
        this.hatsound = cc.audioEngine.play(this.hat_audio, true, 0.5);
        return;
    },
    play_bedsound: function () {
        if (this.sound===false) return;
        this.hatsound = cc.audioEngine.play(this.bed_audio, false, 0.5);
        return;
    },
    play_rocketsound: function () {
        if (this.sound===false) return;
        this.rocketsound = cc.audioEngine.play(this.rocket_audio, true, 0.5);
        return;
    },

    onKeyDown(event) {
        // set a flag when key pressed
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = true;
                break;
            case cc.macro.KEY.d:
                this.accRight = true;
                break;
        }
    },

    onKeyUp(event) {
        // unset a flag when key released
        switch (event.keyCode) {
            case cc.macro.KEY.a:
                this.accLeft = false;
                break;
            case cc.macro.KEY.d:
                this.accRight = false;
                break;
        }
    },

    onMove(event) {
        this.accelx = this.sensibility * event.acc.x;

    },

    set_low_sensibility:function()
    {
        //console.log('sen_low')
        this.sensibility=5;
    },

    set_medium_sensibility:function()
    {
        //console.log('sen_medium')
        this.sensibility=20;
    },
    set_high_sensibility:function()
    {
        //console.log('sen_high')
        this.sensibility=40;
    },
  


    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        //this.jumpAction = this.setJumpAction();

        //this.MoveAction=this.setMoveAction();
        //this.node.runAction(this.jumpAction);

        var b = cc.director.getWinSizeInPixels()
        this.maxwidth = b.width
        this.maxheight = b.height
        this.accLeft = false;
        this.accRight = false;
        this.accelx = 0;
        this.speedy_2 = 0;
        this.acc_2 = 1;
        this.accely = -600;
        this.hatdis = 0;
        this.right = true;
        this.left = false;
        this.alive = true;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        cc.systemEvent.setAccelerometerEnabled(true);
        cc.systemEvent.on(cc.SystemEvent.EventType.DEVICEMOTION, this.onMove, this);
        //this.pic='default';
        console.log(this.pic)

    },

    start() {
        this.loaded=false;
        this.timer = 0;
        window.die=false;

    },





    update(dt) {
        this.timer=this.timer+1;
        if (this.scalerate<1)
        {
        
            this.node.scale=this.node.scale*this.scalerate;
            if (this.node.scale<=0.1)
            {
                if (this.loaded===false)
                {
                cc.director.loadScene('gameover');
                this.loaded=true;
                }
                window.score=this.game.getComponent('Game').score;
                return;
            }
            this.node.x=this.node.x+this.speedx*dt;
            this.node.y=this.node.y+this.speedy*dt;
            if (this.protected===true)
            {
                this.bubble.x=this.bubble.x+this.speedx*dt;
                this.bubble.y=this.bubble.y+this.speedy*dt;
                this.bubble.scale=this.bubble.scale*this.scalerate;
            }
            return;
        }
        if ((this.node.y+this.node.height/2<-this.game.getComponent('Game').maxY)&&(this.fall===false))
        {
           this.fall=true;
           //this.node.y=this.node.y+2*this.game.getComponent('Game').maxY;
           this.game.getComponent('Game').speed=this.game.getComponent('Game').maxY*2;
           this.speedy=this.game.getComponent('Game').maxY;
            
        }
        if (this.fall===true)
        {
            this.speedy=this.speedy-this.game.getComponent('Game').maxY*dt;
            this.node.y=this.node.y+this.speedy*dt;

            if ((Math.abs(this.speedy)<=10)&&(this.restart>=1))
            {
                this.game.getComponent('Game').speed=0;
                this.protected=true;
                this.onrocket=true;
                this.play_rocketsound();
                this.restart=this.restart-1;
                this.speedy=700;
                this.fall=false;
                this.alive=true;
            }

            if ((Math.abs(this.speedy)<=10)&&(this.restart==0))
            {
                if (this.loaded===false)
                {
                cc.director.loadScene('gameover');
                this.loaded=true;
                }
                window.score=this.game.getComponent('Game').score;
                return;
            }
            return;
        }
       


        this.path = './player/' + this.pic;
        
        if ((this.onhat === false) && (this.onrocket === false)) this.speedy = this.speedy + this.accely * dt;
        this.speedy_2 = this.speedy_2 + this.acc_2 * dt;
        if (this.speedy_2 > 0) this.speedy_2 = 0;
        this.speedx = this.accelx * 80;//60;
/*
        this.speedx = 0;
        if (this.accLeft) { this.speedx = -80; }

        if (this.accRight) { this.speedx = 80; }
*/


        var self = this;





        if ((this.left === true) && (this.onhat === false) && (this.onrocket === false)) {
            cc.loader.loadRes(this.path + "/origin_left", cc.SpriteFrame, function (err, spriteFrame) {
                self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            });
        }
        else if ((this.right === true) && (this.onhat === false) && (this.onrocket === false)) {
            cc.loader.loadRes(this.path + "/origin_right", cc.SpriteFrame, function (err, spriteFrame) {
                self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;

            });
        }
        else if ((this.right === true) && (this.onhat === true)) {
            if (this.timer % 2 === 0) {
                cc.loader.loadRes(this.path + "/hat_right", cc.SpriteFrame, function (err, spriteFrame) {
                    self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;

                });
            }
            else {
                cc.loader.loadRes(this.path + "/hat_right_2", cc.SpriteFrame, function (err, spriteFrame) {
                    self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                }
                );
            }

        }
        else if ((this.left === true) && (this.onhat === true)) {
            if (this.timer % 2 === 0) {
                cc.loader.loadRes(this.path + "/hat_left", cc.SpriteFrame, function (err, spriteFrame) {
                    self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;

                });
            }
            else {
                cc.loader.loadRes(this.path + "/hat_left_2", cc.SpriteFrame, function (err, spriteFrame) {
                    self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;

                });
            }
        }

        else if ((this.right === true) && (this.onrocket === true)) {

            cc.loader.loadRes(this.path + "/rocket_right", cc.SpriteFrame, function (err, spriteFrame) {
                self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;

            });


        }
        else if ((this.left === true) && (this.onrocket === true)) {

            cc.loader.loadRes(this.path + "/rocket_left", cc.SpriteFrame, function (err, spriteFrame) {
                self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;

            });

        }





        var newx = this.node.x + this.speedx * dt;
        if (newx < -this.game.maxX) newx = newx + 2 * this.game.maxX;
        if (newx > this.game.maxX) newx = newx - 2 * this.game.maxX
        this.node.x = newx;
        if (this.alive === false) {
            cc.audioEngine.stop(this.hatsound);
        }

        if (this.onhat === true) {
            this.hatdis += this.speedy * dt;
            if (this.hatdis > 3 * this.game.maxY) {

                this.onhat = false; this.hatdis = 0;
                cc.audioEngine.stop(this.hatsound);


                if (this.left === true) {
                    cc.loader.loadRes(this.path + "/origin_left", cc.SpriteFrame, function (err, spriteFrame) {
                        self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                    });

                }
                else if (this.right === true) {
                    cc.loader.loadRes(this.path + "/origin_right", cc.SpriteFrame, function (err, spriteFrame) {
                        self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;

                    });
                }


            }

        }

            if (this.onrocket === true) {
                this.rocketdis += this.speedy * dt;
                if (this.rocketdis > 6 * this.game.maxY) {

                    this.onrocket = false; this.rocketdis = 0;
                    cc.audioEngine.stop(this.rocketsound);


                    if (this.left === true) {
                        cc.loader.loadRes(this.path + "/origin_left", cc.SpriteFrame, function (err, spriteFrame) {
                            self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                        });

                    }
                    else if (this.right === true) {
                        cc.loader.loadRes(this.path + "/origin_right", cc.SpriteFrame, function (err, spriteFrame) {
                            self.node.getComponent(cc.Sprite).spriteFrame = spriteFrame;

                        });
                    }


                }





            }


            this.node.y = this.speedy * dt + this.node.y + this.game.getComponent('Game').speed * dt;
            if (this.speedx < 0) { this.right = false; this.left = true; }
            if (this.speedx > 0) { this.right = true; this.left = false; }
            if (this.node.y < -this.game.maxY) this.alive = false;
            if (this.protected === true) {
                //this.bubble.active=true;

                this.bubble.x = this.node.x;//-this.node.width/4;
                this.bubble.y = this.node.y;
                this.protected_time += dt;
            }

            if (this.protected_time > 10) {
                this.protected = false; this.protected_time = 0;
                this.bubble.x = -2 * this.game.getComponent('Game').maxX;
                this.bubble.y = -2 * this.game.getComponent('Game').maxY;
            }
        }
    });
