const buttons = document.getElementsByClassName('exclusive');

const now = new Date();
const time = now.getHours();
const day = now.getDay();


if(day<=5){
    
    if(time < 11 || time > 15){
        for(i=0;i<buttons.length;i++){
            buttons[i].style.display="none"
        }
    
        

    }
   

}