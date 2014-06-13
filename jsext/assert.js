function assert(assertString, thisObj) {
  var throwException = arguments.length > 2 ? arguments[2] : false;
  var argsObj = arguments.length > 3 ? arguments[3] : {};
  var argsString = "";
  for (var property in argsObj) {
    argsString += ("var " + property + " = " + argsObj[property].toSource() +";\n");
  }
  var func = new Function(argsString + "return (" + assertString + ");");
  var mustBeTrue = false;
  try {
    mustBeTrue = func.apply(thisObj);
  }
  catch(e) {
    // fall through.  An exception will leave mustBeTrue as false, and the assertion still fails.
  }
  
  try {
    if (!mustBeTrue) {
     throw new Error("ECMAScript assertion failed:  (" + assertString + ")");
    }
  }
  catch(e) {
    if (throwException) {
/* For Mozilla, use
      throw new Error(e.message + " stack:\n" + e.stack);
*/
      throw e;
    } else {
/* For Mozilla, use
      dump ("Warning: " + e.message + " stack:\n" + e.stack);
      for (property in argsObj) {
        dump(property + " = " + argsObj[property] + "\n");
      }
      dump("\n");
*/
      alert(e);
    }
  }
  return mustBeTrue;
}
/*
The second argument is the this object of the code calling the assert(). So you could basically call the assert() like this:

Code:

assert("1 == 1", this);

The optional third argument, which defaults to false, determines if a JavaScript error should be thrown. A false value means notify the user, but don't stop execution (dump() is a Mozilla-specific function, used in debug builds). A true value means throw the exception.

The fourth argument should be an object literal for passing variables into the assertion for evaluation. For instance:

Code:

if (assert("x == 1", this, false, {
  x: 1
} )) {
  html_input.value = "x is indeed equal to one!";
}

All this works because the assert() function creates a local function object based on the information you feed it, and then executes that function.
*/