function reverseString(word){
    var reverseString = ""; //empty string. will put reverse string in here.
    for(var i = word.length - 1; i >= 0; i--){ //use decrement to start from end of array
       reverseString += word[i]; //add each character to reversestring;
    }
    return reverseString;
}

console.log(reverseString("hello"));
