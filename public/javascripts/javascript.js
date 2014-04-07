window.onload = function() {
    document.getElementById('tbx_input').focus();
};

function KeyPressed(event)  {
    /* Enter was being pressed */
    if(event.keyCode == 13)  {
        ButtonClick(document.getElementById('tbx_input').value);
    }
}

function ButtonClick(url)  {
    var textbox = document.getElementById('tbx_input');
        
    /* no text has been entered */    
    if (textbox.value == "") {
        alert("Keinen Text eingegeben!");
        textbox.focus();
        return;
    }         
    
    textbox.value = "";
    textbox.focus();
    /* simulate the click for the hidden element */            
    ("#hidden_send").click();
}