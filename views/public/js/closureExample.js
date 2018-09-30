//Closure examples

//Example 1:
//basic closure
//closures are functions inside other functions that have access to the outer functions variables
// and parameters. Examples include callbacks and event handlers. 
function showName(firstName){
    let nameIntro = "Your name is: ";

    function fullName(lastName){
        return nameIntro + firstName + lastName; //fullName returns variable and two parameters
    }

    return fullName; //we want to return the inner function
}

console.log(showName("Tyler "));
console.log(showName("Seubert"))

//Example 2:



