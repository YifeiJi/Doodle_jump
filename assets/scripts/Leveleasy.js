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
       toggle: cc.Toggle
    },

    onLoad: function () {
       console.log(window.level)
       if (window.level==='easy')
       this.toggle.isChecked=true;
       this.toggle.node.on('toggle', this.callback, this);
     
    },

    callback: function (event) {
       var toggle = event;
      
       if(toggle.isChecked){
       
        window.level='easy';
       }
       
    }
});
