window.onload = function() {
    document.getElementById('tbx_input').focus();
};

function KeyPressed(event)  {
    /* Enter was being pressed */
    if(event.keyCode == 13)  {
        var textbox = document.getElementById('tbx_input');
        textbox.value = "";
        textbox.focus();
    }
}