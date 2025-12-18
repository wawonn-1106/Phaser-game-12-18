import {Player} from './Player.js';
import DialogManager from './DialogManager.js';

class MyGame extends Phaser.Scene{
    constructor(){
        super({key:'MyGame'});

        this.player=null;
        this.cursors=null;
    }
    preload(){
        this.load.image('tileset','assets/tileset.jpg');
        this.load.image('sky','assets/sky.png');
        this.load.spritesheet(
            'player',
            'assets/16x16 Adventurer .png',
            {
                frameWidth:16,
                frameHeight:16,
                margin:23,
                spacing:17
            }
        );
        this.load.json('myDialogs','assets/data/dialog.json');
    }
    create(){
        //------------------------------------------------------------マップ---------------------------------------------------------
        this.add.image(0,0,'sky').setOrigin(0,0).setScale(20);
        const mapData=[
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
            [3,3,3,3,3,3,3,3,3,3],
            [3,3,3,3,3,3,3,3,3,3],
            [3,3,3,3,3,3,3,3,3,3]
        ];
        const map=this.make.tilemap({
            data:mapData,
            tileWidth:50,
            tileHeight:50
        });
        const tileset=map.addTilesetImage('tileset','tileset');
        const worldLayer=map.createLayer(0,tileset,0,0);
        worldLayer.setCollision([3]);
        //------------------------------------------------------------キー入力---------------------------------------------------------
        this.cursors=this.input.keyboard.createCursorKeys();
        //------------------------------------------------------------アニメーション---------------------------------------------------------
        this.anims.create({
            key: 'idle',
            frames: [{key:'player',frame:0}], 
            frameRate: 5,
            repeat: -1
        });
        this.anims.create({
            key:'runRight',
            frames:this.anims.generateFrameNumbers('player',{start:19,end:25}),
            frameRate:12,
        });
        this.anims.create({
            key:'runLeft',
            frames:this.anims.generateFrameNumbers('player',{start:12,end:23}),
            frameRate:12,
        });
        //------------------------------------------------------ダイアログ----------------------------------------------------------------
        this.dialogManager=new DialogManager();
        const allData=this.cache.json.get('myDialogs');
        const ch1Opening=allData.chapter1.opening;

        this.input.keyboard.on('keydown',()=>{
            if(!this.dialogManager.isTalking){
                this.dialogManager.start(ch1Opening);
            }else{
                this.dialogManager.showLine();
            }
        })
        //------------------------------------------------------------プレイヤー---------------------------------------------------------
        this.player=new Player(this,100,100,'player');

        this.physics.add.collider(this.player,worldLayer);
        //------------------------------------------------------------インベントリ---------------------------------------------------------
        this.registry.set('gold', 0);
        this.registry.set('inventory', [
            {name: '薬草', amount: 1},
            {name: '薬草', amount: 1},
        ]);
        //DOM要素のキャッシュクリア
        this.goldDisplay = document.getElementById('gold-display');
        this.itemList = document.getElementById('item-list');
        this.inventoryUI = document.getElementById('inventory-ui');
        this.keyI = this.input.keyboard.addKey('I');
        //------------------------------------------------------------------カメラ---------------------------------------------------------
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setBounds(0,0,500,500);
    }
    update(){
        this.player.update();
        const gold=this.registry.get('gold');
        const inv=this.registry.get('inventory');

        document.getElementById('gold-display').innerText=gold;

        const listElement=document.getElementById('item-list');
        listElement.innerHTML='';

        inv.forEach(item=>{
            const li=document.createElement('li');
            li.innerHTML=`<span>${item.name}</span> <span>${item.amount}</span>`;
            listElement.appendChild(li);
        });

        if(Phaser.Input.Keyboard.JustDown(this.input.keyboard.addKey('I'))){
            const ui=document.getElementById('inventory-ui');
            ui.style.display=(ui.style.display==='none')?'block':'none';
        }
    }
}

const config={
    type:Phaser.AUTO,
    width:500,
    height:500,
    physics:{
        default:'arcade',
        arcade:{
            gravity:{y:300},
            debug:true
        }
    },
    scene:MyGame
}

const game=new Phaser.Game(config);