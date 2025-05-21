const buttons = document.getElementsByClassName('exclusive');
const blockes = document.getElementsByClassName('blocked');
const now = new Date();
const time = now.getHours();
const day = now.getDay();


if(day<=5){
    
    if(time < 11 || time > 14){
        for(i=0;i<buttons.length;i++){
            buttons[i].style.display="none"
            
        }
        enableblockedbutton();
    }
    else{
        disableblockbutton();
    }
   
}
else{
    disableblockbutton();
}
function enableblockedbutton(){
    for(x=0;x<=blockes.length;x++){
        blockes[x].style.display='block';
    }
}
function disableblockbutton(){
    for(x=0;x<=blockes.length;x++){
        blockes[x].style.display='none';
    }
}