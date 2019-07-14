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
        bubble: {
            default: null,
            type: cc.Node
        },

        basicblock:{
            default: null,
            type: cc.Prefab
        },
        leftrightblock:{
            default: null,
            type: cc.Prefab
        },
        playerfab:{
            default: null,
            type: cc.Prefab
        },
        hatfab:{
            default: null,
            type: cc.Prefab
        }, 
        bedfab:{
            default: null,
            type: cc.Prefab
        }, 
        protectionfab:{
            default: null,
            type: cc.Prefab
        }, 

        monsterfab:{
            default: null,
            type: cc.Prefab
        },
        maxX :0,
        maxY: 0,
        speed: 0,
        speed_block:0,
        acc_block:1
    },

    onLoad: function () {
        // 初始化计时器
        this.timer = 0;
        this.maxX=this.node.width/2;
        this.maxY=this.node.height/2;
        this.interval_a=80;
        this.interval_b=25;
        this.maxBlockHeight=-this.maxY;
        this.line=-this.maxY;
        this.speed=0;
        this.speed_block=0;
        this.acc_block=50;
        //cc.game.on('move-down', this.moveDown, this);
     
    },

    resume:function(e)
    {
        cc.director.resume();
        this.pausebutton.getChildByName("Label").getComponent(cc.Label).string='Pause';
        this.pausebutton.node.off('click',this.resume,this);
        this.pausebutton.node.on('click',this.pause,this);
        },

    pause:function(e)
    {
        cc.director.pause();
        this.pausebutton.getChildByName("Label").getComponent(cc.Label).string='Resume';
        this.pausebutton.node.off('click',this.pause,this);
        this.pausebutton.node.on('click',this.resume,this);
        },

start(){
    var bg=this.bg;
    bg.setContentSize(2*this.maxX,2*this.maxY);
    this.bubble.setPosition(-2*this.maxX,-2*this.maxY);
    //fitHeight=true;
    //bg.fitWidth=true;
    this.pausebutton.node.setPosition(this.maxX-this.pausebutton.node.width,-this.maxY+this.pausebutton.node.height);
    this.pausebutton.node.zIndex=2;
    //this.pausebutton.node.on(cc.Node.EventType.TOUCH_START,this.stop(),this);
    this.pausebutton.node.on('click',this.pause,this);
    
    var newplayer = cc.instantiate(this.playerfab);

    this.node.addChild(newplayer,2);
    newplayer.setPosition(0,-this.maxY*0.6+30,10000);
    newplayer.getComponent('Player').game = this;
    this.player=newplayer;
    //this.player.setZOrder(100);
    (this.scoreDisplay).x=-100;
    (this.scoreDisplay).y=-100;
    
    //this.node.addChild(this.bubble);
    this.player.getComponent('Player').bubble=this.bubble;

    //cc.game.on('move-down', this.moveDown, this);
    //cc.game.on('all-move-down', this.allmoveDown, this);

    this.produceBlock(0,-this.maxY*0.6-30);

},


    produceBlock:function(x,y)
    {
        var newBlock = cc.instantiate(this.basicblock);
        //newBlock.getComponent('Block').type='basic';
        this.node.addChild(newBlock,0);
        
        // 为星星设置一个随机位置
        newBlock.setPosition(x,y,0);
        newBlock.getComponent('Block').game = this;
        if (y>this.maxBlockHeight) this.maxBlockHeight=y;
        newBlock.getComponent('Block').type='basic';
    },

    RandomproduceBlock:function(input)
    {
        var y=input;
        var randx;
        var randy;

        while(this.maxBlockHeight<this.line+3*this.maxY)
        {
        
        
        
        randx=(Math.random() - 0.5) * 2 * 0.9*this.maxX;
        if(Math.random()>0.6) randy=y+Math.random()*this.interval_b+40; else
        randy=y+Math.random()*this.interval_b+40;


        var newBlock;
        if ((Math.random()>0.95)&&(this.maxBlockHeight>4*this.maxY))
        {
            newBlock= cc.instantiate(this.basicblock);
            this.node.addChild(newBlock,0);
        newBlock.getComponent('Block').type='bed';
        newBlock.getComponent('Block').game = this;
        newBlock.getComponent('Block').originy=randy;
        newBlock.setPosition(randx-newBlock.width*0.5,randy-this.line-this.maxY,0);

        }

        else if ((Math.random()>0.9)&&(this.maxBlockHeight>8*this.maxY))
        {
            newBlock= cc.instantiate(this.basicblock);
            this.node.addChild(newBlock,0);
        newBlock.getComponent('Block').type='protection';
        newBlock.getComponent('Block').game = this;
        newBlock.getComponent('Block').originy=randy;
        newBlock.setPosition(randx-newBlock.width*0.5,randy-this.line-this.maxY,0);


        }
        

        else if (Math.random()>0.3)
        {newBlock= cc.instantiate(this.basicblock);
            this.node.addChild(newBlock,0);
        newBlock.getComponent('Block').type='basic';
        newBlock.getComponent('Block').game = this;
        newBlock.getComponent('Block').originy=randy;
        newBlock.setPosition(randx-newBlock.width*0.5,randy-this.line-this.maxY,0);
    
    }
        else
        if (Math.random()>0.9)        
        { newBlock= cc.instantiate(this.basicblock);
            this.node.addChild(newBlock,0);
        newBlock.getComponent('Block').type='hat';
        newBlock.getComponent('Block').game = this;
        newBlock.getComponent('Block').originy=randy;
        newBlock.setPosition(randx-newBlock.width*0.5,randy-this.line-this.maxY,0);

        }
        else 
        {
            newBlock= cc.instantiate(this.leftrightblock);
        newBlock.getComponent('Block').type='leftright';
        this.node.addChild(newBlock,0);
        newBlock.getComponent('Block').game = this;
        newBlock.getComponent('Block').originy=randy;
        newBlock.setPosition(randx-newBlock.width*0.5,randy-this.line-this.maxY,0);
        }




        if ( newBlock.getComponent('Block').type==='hat')
        {
            var newhat=cc.instantiate(this.hatfab);
            this.node.addChild(newhat);
            newBlock.getComponent('Block').hat=newhat;
            //newhat.getComponent('Hat').game = this;
            newhat.setPosition(randx-newhat.width*0.5,randy-this.line-this.maxY+newBlock.height,0);
            randy+=newhat.height;
        }

        if ( newBlock.getComponent('Block').type==='protection')
        {
            var newprotection=cc.instantiate(this.protectionfab);
            this.node.addChild(newprotection);
            newBlock.getComponent('Block').protection=newprotection;
            //newhat.getComponent('Hat').game = this;
            newprotection.setPosition(randx-newprotection.width*0.5,randy-this.line-this.maxY+newBlock.height,0);
            randy+=newprotection.height;
        }
        if ( newBlock.getComponent('Block').type==='bed')
        {
            var newbed=cc.instantiate(this.bedfab);
            this.node.addChild(newbed,0);
            newBlock.getComponent('Block').bed=newbed;
            //newhat.getComponent('Hat').game = this;
            newbed.setPosition(randx-newbed.width*0.5+newbed.width/2,randy-this.line-this.maxY+newBlock.height+newbed.height/4,0);
            randy+=newbed.height;
        }



        if (randy>this.maxBlockHeight) this.maxBlockHeight=randy;
        y=randy;
        if (newBlock.getComponent('Block').type==='hat') y=y+newhat.height;

        if ((Math.random()>0.9)&&(this.maxBlockHeight>10*this.maxY))
        {
            var newmonster=cc.instantiate(this.monsterfab);
            this.node.addChild(newmonster,0);
            newmonster.getComponent('Monster').game = this;
            randx=(Math.random() - 0.5) * 2 * 0.9*this.maxX;
            randy=y+Math.random()*this.interval_b+30;
            newmonster.setPosition(randx-newBlock.width*0.5,randy-this.line-this.maxY,0);
            y=randy+newmonster.height;


       

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
        
        this.speed=0;//-(this.player.y)/1000;
        if (this.player.y>0)
        this.speed=-(this.player.y/(this.maxY*0.4))*this.player.getComponent('Player').speedy;
        if (this.player.getComponent('Player').onhat===true) this.speed=-(this.player.y);
        if (this.speed>0) this.speed=0;
        //this.speed=0
             
        this.timer += dt;
        this.line=this.line-this.speed*dt+this.speed_block*dt;
        if (this.maxBlockHeight-this.line<2*this.maxY) this.RandomproduceBlock(this.maxBlockHeight);
      
        if (this.speed_block>0)
        this.speed_block=this.speed_block-this.acc_block*dt;
        if (this.speed_block<0) 
        this.speed_block=0;
        //this.line=this.line-this.speed*dt+this.speed_block*dt;
        if (this.player.getComponent('Player').alive===true)
        this.scoreDisplay.string = 'Score: ' + parseInt((this.line+this.maxY)/10);
      
    }
    
});
