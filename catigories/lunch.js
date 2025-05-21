const lunchmeals = document.getElementsByClassName('lunch');
const lunchprices = document.getElementsByClassName('altprice');

const now = new Date();
const time = now.getHours();
const day = now.getDay();


function enablelunchprices(){
    
    for(i=0;i<lunchmeals.length;i++){
        
       
        lunchmeals[i].innerHTML="Lunch time:$10.99"
        console.log(lunchprices.length);
        for(x=0;x<lunchprices.length;x++){
            
            lunchprices[x].dataset.price = 10.99
          
        }
        

       
    
    }

}
function disablelunchprices(){
    for(i=0;i<lunchmeals.length;i++){
       
       
        lunchmeals[i].innerHTML="$14.99"
        
        for(x=0;x<lunchprices.length;x++){
            lunchprices[x].dataset.price = 14.99
        }
    
    }

}

disablelunchprices();


if(day<=5){
    
    if(time >= 11 && time <= 15){
        enablelunchprices();
        

    }
   

}
