cc.Class({
    extends: cc.Component,

    properties: {

        scoreDisplay: {
            default: null,
            type: cc.Label
        },
        pausebutton: {
            default: null,
            type: cc.Button
        },

        bg: {
            default: null,
            type: cc.Node
        },
        mask: {
            default: null,
            type: cc.Node
        },
        winterbg: {
            default: null,
            type: cc.Node
        },
        underwaterbg: {
            default: null,
            type: cc.Node
        },
        bubble: {
            default: null,
            type: cc.Node
        },

        scroll: {
            default: null,
            type: cc.Node
        },
        basicblock: {
            default: null,
            type: cc.Prefab
        },
        winterblock: {
            default: null,
            type: cc.Prefab
        },
        underwaterblock: {
            default: null,
            type: cc.Prefab
        },
        leftrightblock: {
            default: null,
            type: cc.Prefab
        },
        winterleftrightblock: {
            default: null,
            type: cc.Prefab
        },
        onceblock: {
            default: null,
            type: cc.Prefab
        },

        playerfab: {
            default: null,
            type: cc.Prefab
        },
        hatfab: {
            default: null,
            type: cc.Prefab
        },
        rocketfab: {
            default: null,
            type: cc.Prefab
        },
        underwaterhatfab: {
            default: null,
            type: cc.Prefab
        },

        bedfab: {
            default: null,
            type: cc.Prefab
        },
        protectionfab: {
            default: null,
            type: cc.Prefab
        },

        monsterfab: {
            default: null,
            type: cc.Prefab
        },
        wintermonsterfab: {
            default: null,
            type: cc.Prefab
        },
        lochfab: {
            default: null,
            type: cc.Prefab
        },
        maxX: 0,
        maxY: 0,
        speed: 0,
        speed_block: 0,
        acc_block: 1,
        score: 0

    },
  

    onLoad: function () {
        // 初始化计时器
        //this.load_subpackage();
        this.timer = 0;
        this.maxX = this.node.width / 2;
        this.maxY = this.node.height / 2;
        this.interval_hard = 60;
        this.interval_medium = 45;
        this.interval_easy = 30;
        this.interval = this.interval_easy;
        this.maxBlockHeight = -this.maxY;
        this.line = -this.maxY;
        this.speed = 0;
        this.speed_block = 0;
        this.score = 0;
        this.acc_block = 50;
        this.last_loch = -this.maxY;
        this.last_monster = -this.maxY;

    },

    resume: function (e) {
        this.mask.active = false;
        if (this.player.getComponent('Player').onhat === true)
            this.player.getComponent('Player').hatsound = cc.audioEngine.play(this.player.getComponent('Player').hat_audio, true, 0.5);
        if (this.player.getComponent('Player').onrocket === true)
            this.player.getComponent('Player').rocketsound = cc.audioEngine.play(this.player.getComponent('Player').rocket_audio, true, 0.5);
        var q = this.pausebutton.node.children[0].children[0];

        q.getComponent(cc.Label).string = 'Pause';
        this.pausebutton.node.off(cc.Node.EventType.TOUCH_START, this.resume, this);
        cc.director.resume();
        this.pausebutton.node.on(cc.Node.EventType.TOUCH_START, this.pause, this);




    },

    pause: function (e) {
        this.mask.active = true;
        if (this.player.getComponent('Player').onrocket === true)
            cc.audioEngine.stop(this.player.getComponent('Player').rocketsound);
        if (this.player.getComponent('Player').onhat === true)
            cc.audioEngine.stop(this.player.getComponent('Player').hatsound);
        var q = this.pausebutton.node.children[0].children[0];
        q.getComponent(cc.Label).string = 'Resume';

        this.pausebutton.node.off(cc.Node.EventType.TOUCH_START, this.pause, this);
        cc.director.pause();



        this.pausebutton.node.on(cc.Node.EventType.TOUCH_START, this.resume, this);

    },
    produce_player: function () {
        var newplayer = cc.instantiate(this.playerfab);
        newplayer.getComponent('Player').sound = window.sound;
        newplayer.getComponent('Player').restart = window.restart;
        newplayer.getComponent('Player').pic = player_type;

        if (window.sensibility === 'low')
            newplayer.getComponent('Player').set_low_sensibility;
        else if (window.sensibility === 'medium')
            newplayer.getComponent('Player').set_medium_sensibility;
        else if (window.sensibility === 'high')
            newplayer.getComponent('Player').set_high_sensibility;

        this.node.addChild(newplayer, 2);
        newplayer.setPosition(30, -this.maxY * 0.6 + 60, 10000);
        newplayer.getComponent('Player').game = this;
        if (window.start_with_rocket === true) {
            newplayer.getComponent('Player').onrocket = true;
            newplayer.getComponent('Player').setSpeedy(1400);
            newplayer.getComponent('Player').play_rocketsound();
        }
        this.player = newplayer;
        this.player.getComponent('Player').bubble = this.bubble;


    },
    set_level: function () {

        var player = this.player;
        if (window.level == 'hard') {
            this.interval = this.interval_hard;
            this.param_basic = 0.6;
            this.param_once = 0.5;
            this.param_leftright = 0.2;
            this.param_bed = 0.7;
            this.param_protection = 0.6;
            this.param_hat = 0.6;
            this.param_rocket = 0;
            this.param_monster=0.9;
            this.param_monster_move=0.6;
            this.param_loch=0.85;
            this.loch_interval=2*this.maxY;
            this.monster_interval=0.3*this.maxY;
        }
        if (window.level == 'medium') {
            this.interval = this.interval_medium;
            this.param_basic = 0.4;
            this.param_once = 0.5;
            this.param_leftright = 0.5;
            this.param_bed = 0.8;
            this.param_protection = 0.4;
            this.param_hat = 0.4;
            this.param_rocket = 0.2;
            this.param_monster=0.9;
            this.param_monster_move=0.8;
            this.param_loch=0.9;
            this.loch_interval=4*this.maxY;
            this.monster_interval=0.6*this.maxY;
        }
        if (window.level == 'easy') {
            this.interval = this.interval_easy;
            this.param_basic = 0.5;
            this.param_once = 0.7;
            this.param_leftright = 0.6;
            this.param_bed = 0.9;
            this.param_protection = 0.4;
            this.param_hat = 0.5;
            this.param_rocket = 0;
            this.param_monster=0.9;
            this.param_monster_move=1.1;
            this.param_loch=0.95;
            this.loch_interval=6*this.maxY;
            this.monster_interval=this.maxY;
        }

    },
  
    start() {


        //this.load_subpackage();





        // window.player_type = 'winter';
        //window.start_with_rocket = true;
        window.restart = 0;
        window.level = 'hard';
        this.scroll.zIndex = -1;
        this.bg.zIndex = -1;
        this.winterbg.zIndex = -1;

        this.mask.zIndex = 3;
        this.mask.active = false;

        if (window.player_type === 'winter') var bg = this.winterbg;
        else if (window.player_type === 'underwater') var bg = this.underwaterbg;
        else { var bg = this.bg; }
        bg.setContentSize(2 * this.maxX, 2 * this.maxY);
        this.mask.setContentSize(2 * this.maxX, 2 * this.maxY);
        bg.zIndex = 0;
        if (window.player_type == 'jungle') {
            this.scroll.setContentSize(2 * this.maxX, 2 * this.maxY);
            this.scroll.zIndex = 0;
        }
        this.bubble.setPosition(-2 * this.maxX, -2 * this.maxY);
        //fitHeight=true;
        //bg.fitWidth=true;
        this.pausebutton.node.setPosition(this.maxX - this.pausebutton.node.width, -this.maxY + this.pausebutton.node.height);
        this.pausebutton.node.zIndex = 5;
        //this.pausebutton.node.on(cc.Node.EventType.TOUCH_START,this.stop(),this);
        this.pausebutton.node.on(cc.Node.EventType.TOUCH_START, this.pause, this);
        var player_type = window.player_type;
        //var player_type='winter';
        //player_type='winter';
        //this.produce_player();

        var newplayer = cc.instantiate(this.playerfab);
        newplayer.getComponent('Player').sound = window.sound;
        newplayer.getComponent('Player').restart = window.restart;
        newplayer.getComponent('Player').pic = player_type;

        if (window.sensibility === 'low')
            newplayer.getComponent('Player').set_low_sensibility;
        else if (window.sensibility === 'medium')
            newplayer.getComponent('Player').set_medium_sensibility;
        else if (window.sensibility === 'high')
            newplayer.getComponent('Player').set_high_sensibility;

        this.node.addChild(newplayer, 2);
        newplayer.setPosition(30, -this.maxY * 0.6 + 100, 10000);
        newplayer.getComponent('Player').game = this;
        if (window.start_with_rocket === true) {
            newplayer.getComponent('Player').onrocket = true;
            newplayer.getComponent('Player').setSpeedy(1400);
            newplayer.getComponent('Player').play_rocketsound();
        }
        this.player = newplayer;
        this.player.getComponent('Player').bubble = this.bubble;




        this.set_level();
        (this.scoreDisplay).x = -100;
        (this.scoreDisplay).y = -100;


        this.produceBlock(0, -this.maxY * 0.6 - 30);

        //this.produceBlock(0, -this.maxY * 0.6 - 0);


        //this.produceBlock(0, -this.maxY * 0.6 + 30);

        // this.RandomproduceBlock(this.maxBlockHeight);

    },


    produceBlock: function (x, y) {
        var newBlock = cc.instantiate(this.basicblock);
        if (window.player_type === 'winter') newBlock = cc.instantiate(this.winterblock);
        else if (player_type === 'underwater') newBlock = cc.instantiate(this.underwaterblock);
        //newBlock.getComponent('Block').type='basic';
        this.node.addChild(newBlock, 0);

        // 为星星设置一个随机位置
        newBlock.setPosition(x, y, 0);
        newBlock.getComponent('Block').game = this;
        if (y > this.maxBlockHeight) this.maxBlockHeight = y;
        newBlock.getComponent('Block').type = 'basic';
    },

    RandomproduceBlock: function (input) {

        var y = input;
        var randx;
        var randy;
        //this.param_leftright = 0;
        var player_type = window.player_type;







        while (this.maxBlockHeight < this.line + 4 * this.maxY) {



            randx = (Math.random() - 0.5) * 2 * 0.9 * this.maxX;
            if (Math.random() > 0.6) randy = y + Math.random() * this.interval + 40; else
                randy = y + Math.random() * this.interval * (1 + Math.random()) + 40;


            var newBlock;
            if (Math.random() > this.param_basic) {
                if (player_type === 'winter') newBlock = cc.instantiate(this.winterblock);
                else if (player_type === 'underwater') newBlock = cc.instantiate(this.underwaterblock);
                else
                    newBlock = cc.instantiate(this.basicblock);

                this.node.addChild(newBlock, 0);
                newBlock.getComponent('Block').type = 'basic';
                newBlock.getComponent('Block').game = this;
                newBlock.getComponent('Block').originy = randy;
                newBlock.setPosition(randx - newBlock.width * 0.5, randy - this.line - this.maxY, 0);

            }
            else if ((Math.random() > this.param_once) && (this.maxBlockHeight > -10 * this.maxY)) {
                newBlock = cc.instantiate(this.onceblock);
                this.node.addChild(newBlock, 0);
                newBlock.getComponent('Block').type = 'once';
                newBlock.getComponent('Block').game = this;
                newBlock.getComponent('Block').originy = randy;
                newBlock.setPosition(randx - newBlock.width * 0.5, randy - this.line - this.maxY, 0);
            }

            else if (Math.random() > this.param_leftright) {
                if ((player_type === 'winter') || (player_type === 'underwater')) newBlock = cc.instantiate(this.winterleftrightblock);
                else
                    newBlock = cc.instantiate(this.leftrightblock);

                newBlock.getComponent('Block').type = 'leftright';
                this.node.addChild(newBlock, 0);
                newBlock.getComponent('Block').game = this;
                newBlock.getComponent('Block').originy = randy;
                newBlock.setPosition(randx - newBlock.width * 0.5, randy - this.line - this.maxY, 0);
            }


            else if ((Math.random() > this.param_bed) && (this.maxBlockHeight > -10 * this.maxY)) {
                if (player_type === 'winter') newBlock = cc.instantiate(this.winterblock);
                else if (player_type === 'underwater') newBlock = cc.instantiate(this.underwaterblock);
                else
                    newBlock = cc.instantiate(this.basicblock);

                this.node.addChild(newBlock, 0);
                newBlock.getComponent('Block').type = 'bed';
                newBlock.getComponent('Block').game = this;
                newBlock.getComponent('Block').originy = randy;
                newBlock.setPosition(randx - newBlock.width * 0.5, randy - this.line - this.maxY, 0);

            }

            else if ((Math.random() > this.param_protection) && (this.maxBlockHeight > -8 * this.maxY)) {
                if (player_type === 'winter') newBlock = cc.instantiate(this.winterblock);
                else if (player_type === 'underwater') newBlock = cc.instantiate(this.underwaterblock);
                else
                    newBlock = cc.instantiate(this.basicblock);

                this.node.addChild(newBlock, 0);
                newBlock.getComponent('Block').type = 'protection';
                newBlock.getComponent('Block').game = this;
                newBlock.getComponent('Block').originy = randy;
                newBlock.setPosition(randx - newBlock.width * 0.5, randy - this.line - this.maxY, 0);


            }



            else
                if (Math.random() > this.param_hat) {

                    if (player_type === 'winter') newBlock = cc.instantiate(this.winterblock);
                    else if (player_type === 'underwater') newBlock = cc.instantiate(this.underwaterblock);
                    else
                        newBlock = cc.instantiate(this.basicblock);

                    this.node.addChild(newBlock, 0);
                    newBlock.getComponent('Block').type = 'hat';
                    newBlock.getComponent('Block').game = this;
                    newBlock.getComponent('Block').originy = randy;
                    newBlock.setPosition(randx - newBlock.width * 0.5, randy - this.line - this.maxY, 0);

                }

                else  if (Math.random() > this.param_rocket){

                    if (player_type === 'winter') newBlock = cc.instantiate(this.winterblock);
                    else if (player_type === 'underwater') newBlock = cc.instantiate(this.underwaterblock);
                    else
                        newBlock = cc.instantiate(this.basicblock);

                    this.node.addChild(newBlock, 0);
                    newBlock.getComponent('Block').type = 'rocket';
                    newBlock.getComponent('Block').game = this;
                    newBlock.getComponent('Block').originy = randy;
                    newBlock.setPosition(randx - newBlock.width * 0.5, randy - this.line - this.maxY, 0);

                }

             else 
             {
                 if (player_type === 'winter') newBlock = cc.instantiate(this.winterblock);
                 else if (player_type === 'underwater') newBlock = cc.instantiate(this.underwaterblock);
                 else
                     newBlock = cc.instantiate(this.basicblock);
 
                 this.node.addChild(newBlock, 0);
                 newBlock.getComponent('Block').type = 'basic';
                 newBlock.getComponent('Block').game = this;
                 newBlock.getComponent('Block').originy = randy;
                 newBlock.setPosition(randx - newBlock.width * 0.5, randy - this.line - this.maxY, 0);
 
             }




            if (newBlock.getComponent('Block').type === 'hat') {
                if (player_type === 'underwater') { var newhat = cc.instantiate(this.underwaterhatfab); } else { var newhat = cc.instantiate(this.hatfab); }
                this.node.addChild(newhat);
                newBlock.getComponent('Block').hat = newhat;
                //newhat.getComponent('Hat').game = this;
                newhat.setPosition(randx - newhat.width * 0.5, randy - this.line - this.maxY + newBlock.height, 0);
                randy += newhat.height;
            }

            if (newBlock.getComponent('Block').type === 'rocket') {
                var newrocket = cc.instantiate(this.rocketfab);
                this.node.addChild(newrocket);
                newBlock.getComponent('Block').rocket = newrocket;
                //newhat.getComponent('Hat').game = this;
                newrocket.setPosition(randx - newrocket.width * 0.5, randy - this.line - this.maxY + newBlock.height, 0);
                randy += newrocket.height;
            }


            if (newBlock.getComponent('Block').type === 'protection') {
                var newprotection = cc.instantiate(this.protectionfab);
                this.node.addChild(newprotection);
                newBlock.getComponent('Block').protection = newprotection;
                //newhat.getComponent('Hat').game = this;
                newprotection.setPosition(randx - newprotection.width * 0.5, randy - this.line - this.maxY + newBlock.height, 0);
                randy += newprotection.height;
            }

            if (newBlock.getComponent('Block').type === 'bed') {
                var newbed = cc.instantiate(this.bedfab);
                newbed.getComponent('Bed').type = player_type;
                newbed.getComponent('Bed').show();
                this.node.addChild(newbed, 0);
                newBlock.getComponent('Block').bed = newbed;
                //newhat.getComponent('Hat').game = this;
                newbed.setPosition(randx - newbed.width * 0.5 + newbed.width / 2, randy - this.line - this.maxY + newBlock.height + newbed.height / 4, 0);
                randy += newbed.height;
            }



            if (randy > this.maxBlockHeight) this.maxBlockHeight = randy;
            y = randy;


            if ((Math.random() > this.param_monster) && (this.maxBlockHeight > 10 * this.maxY)) {


                randx = (Math.random() - 0.5) * 2 * 0.9 * this.maxX;
                randy = y + Math.random() * this.interval + 30;
                if (randy >= this.last_monster +this.monster_interval)
                {
                if ((player_type === 'winter') || (player_type === 'underwater'))
                    var newmonster = cc.instantiate(this.wintermonsterfab);
                else
                    var newmonster = cc.instantiate(this.monsterfab);

                this.node.addChild(newmonster, 1);
                if ((player_type === 'default') || (player_type === 'jungle')) {
                    newmonster.getComponent('Monster').game = this;
                    if (Math.random() > this.param_monster_move)
                        newmonster.getComponent('Monster').type = 'move';
                    newmonster.getComponent('Monster').originx = randx;
                }

                if ((player_type === 'winter') || (player_type === 'underwater')) {
                    newmonster.getComponent('WinterMonster').game = this;
                    if (Math.random() > this.param_monster_move)
                        newmonster.getComponent('WinterMonster').type = 'move';
                    newmonster.getComponent('WinterMonster').originx = randx;
                }
                randx = (Math.random() - 0.5) * 2 * 0.9 * this.maxX;
                randy = y + Math.random() * this.interval + 30;
                newmonster.setPosition(randx - newBlock.width * 0.5, randy - this.line - this.maxY, 0);
                this.last_monster = randy + newmonster.height;
                y=y + newmonster.height;
                
            }



            }



            if ((Math.random() > this.param_loch) && (this.maxBlockHeight > 15 * this.maxY)) {


                var newloch = cc.instantiate(this.lochfab);

                this.node.addChild(newloch, 0);
                var scale = (Math.random() * 2 + 1);
                newloch.width = newloch.width * scale;
                newloch.height = newloch.height * scale;
                newloch.getComponent('Loch').game = this;



                randx = (Math.random() - 0.5) * 2 * 0.9 * this.maxX;
                randy = y + Math.random() * this.interval + 30 + newloch.height;
                if (randy < this.last_loch + this.loch_interval) randy = this.last_loch + this.loch_interval;
                newloch.setPosition(randx - newBlock.width * 0.5, randy - this.line - this.maxY, 0);
                //y = randy + newloch.height;
                this.last_loch = randy + newloch.height;




            }


        }


    },
    /*
    moveDown:function(){
 
        //this.node.y=this.node.y-100;
        var speed=this.player.getComponent('Player').speedy;

        return;
        },
*/
    update: function (dt) {
        // 每帧更新计时器，超过限度还没有生成新的星星
        // 就会调用游戏失败逻辑
        if (this.player.getComponent('Player').fall === false) {
            this.speed = 0;//-(this.player.y)/1000;
            if (this.player.y > 0)
                this.speed = -((this.player.y + this.maxY) / (this.maxY * 1.5)) * this.player.getComponent('Player').speedy;
            if (this.player.getComponent('Player').onhat === true) this.speed = -(this.player.y);
            if (this.player.getComponent('Player').onrocket === true) this.speed = -(4 * this.player.y);
            if (this.speed > 0) this.speed = 0;
        }
        if (this.player.getComponent('Player').scalerate < 1) this.speed = 0;
        //this.speed=0

        this.timer += dt;
        this.line = this.line - this.speed * dt + this.speed_block * dt;
        if (this.maxBlockHeight - this.line < 3 * this.maxY) this.RandomproduceBlock(this.maxBlockHeight);

        if (this.speed_block > 0)
            this.speed_block = this.speed_block - this.acc_block * dt;
        if (this.speed_block < 0)
            this.speed_block = 0;
        //this.line=this.line-this.speed*dt+this.speed_block*dt;
        if (this.player.getComponent('Player').alive === true) {
            if ((this.line + this.maxY) / 10 > this.score)
                this.score = parseInt(this.line + this.maxY) / 10;
            this.scoreDisplay.string = 'Score: ' + parseInt(this.score);
        }

    },


});
