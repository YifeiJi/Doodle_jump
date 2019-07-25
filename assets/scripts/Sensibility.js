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
        toggle_1: cc.Toggle,
        toggle_2: cc.Toggle,
        toggle_3: cc.Toggle
     },
 
     onLoad: function () {
         if (window.sensibility==='high')
        this.toggle_1.isChecked=true;
        else  if (window.sensibility==='medium')
        this.toggle_2.isChecked=true;
        else  if (window.sensibility==='low')
        this.toggle_3.isChecked=true;
        else  
        {
            this.toggle_2.isChecked=true;
            window.sensibility='medium'
        }
        //node.on('toggle', this.callback, this);
     },

    // update (dt) {},
});
