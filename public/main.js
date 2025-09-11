AOS.init();

let text = "Aryaman\nSingh"

var i = 0;
function startTypo(){
    setTimeout(typo,300);
}
function typo() {

  
    console.log("hey")
    if (i < text.length) {


        document.getElementById('company-name').innerText += text[i];


        i++;
        setTimeout(typo, 150);

    }

};
 