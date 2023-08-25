
function phoneFormat(input) {//returns (###) ###-####
    input = input.replace(/\D/g,'');
    var size = input.length;
    if (size>0) {input="("+input}
    if (size>3) {input=input.slice(0,4)+") "+input.slice(4,11)}
    if (size>6) {input=input.slice(0,9)+"-" +input.slice(9)}
    return input;
}

function dateFormat(input) {
    input = input.replace(/\D/g,'');
    var size = input.length;
    if (size>2) {input=input.slice(0,2)+"-"+input.slice(2,8)}
    if (size>4) {input=input.slice(0,5)+"-"+input.slice(5)}
    return input;
}
