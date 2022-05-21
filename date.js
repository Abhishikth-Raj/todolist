//console.log(module);//this is a module
//when assigning function to a variable or something else
//paranthesis is not used, it is used only while execution.

// this not any logic, this is just acquiring date.
// so instead of including it in the main server file
// store it in a module and export it into main server file

module.exports.getDate = ()=>{
    const today = new Date();
    const options = {
        weekday: "long",
        day: "numeric", //all to be exact
        month: "long"
    }

   return today.toLocaleDateString("en-US", options);
}//completely resuable



module.exports.getDay = ()=>{
    const today = new Date();
    const options = {
        weekday: "long"
    }

    return day = today.toLocaleDateString("en-US", options);   
}
//console.log(module.exports);