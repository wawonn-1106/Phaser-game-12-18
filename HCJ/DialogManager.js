export default class DialogManager{
    constructor(){
        this.currentSequence=[];
        this.currentIndex=0;
        this.isTalking=false;
    }
    start(dialogArray){
        this.currentSequence=dialogArray;
        this.currentIndex=0;
        this.isTalking=true;

        document.getElementById('dialog-window').style.display='block';
        this.showLine();
    }
    showLine(){
        if(this.currentIndex<this.currentSequence.length){
            const line=this.currentSequence[this.currentIndex];

            document.getElementById('dialog-name').innerHTML=line.name;
            document.getElementById('dialog-text').innerHTML=line.text;

            this.currentIndex++;
        }else{
            this.end();
        }
    }
    end(){
        this.isTalking=false;
        document.getElementById('dialog-window').style.display='none';
    }
}