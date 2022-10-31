// Assignment Code
var generateBtn = document.querySelector("#generate");

// Type-collection object for storing various character types
const charCollection = {
  lowercase: `abcdefghijklmnopqrstuvwxyz`,
  uppercase: `ABCDEFGHIJKLMNOPQRSTUVWXYZ`,
  numeric: `0123456789`,
  special: ` !"#$%&'()*+,-./:;<=>?@[\]^_{|}~` + "`"
};

// Write password to the #password input
function writePassword() {
  var password = generatePassword();
  var passwordText = document.querySelector("#password");

  passwordText.value = password;
}

// Generate passsword based on various criteria
function generatePassword() {

  // Start again if the generated password has not been confirmed by the user
  while (!confirmPassword) {
    var confirmPassword = false;
    var pswTypes = [];
    var includeLength = false;
    var includeType = false;
    var nullCriteria = false;
  
    // Prompt user to either select password criteria or to proceed with auto-generated password without criteria
    while (!includeLength && !includeType && !nullCriteria) {
      includeLength = window.confirm (
        `Include LENGTH of password in password criteria? \nCANCEL: If you do not want to include this criteria.`
      );
      includeType = window.confirm (
        `Include CHARACTER TYPES in password criteria? \nCANCEL: If you do not want to include this criteria.`
      );
      if (!includeLength && !includeType) {
        nullCriteria = window.confirm(`No criteria selected, proceed with auto-generated password?`);
      }
    }
    
    // If length criteria is selected, then get the length of password from user input
    if (includeLength) {
      pswLength = getLength();
      // If user did not input any interger number, then proceed with auto-generated random length
      if (!Number.isInteger(pswLength)) {
        includeLength = false;
      }
    }

    // If length criteria is not selected, then proceed with auto-generated random length
    if (!includeLength) {
      var pswLength = getRandomInt(8, 128);
      var randomLength = window.alert (
        `Unassigned length: \nRandom length for generated passwords: ${pswLength}.`
      );
    }

    // If character type criteria is selected, then get the types of password from user input
    if (includeType) {
      pswTypes = getTypes();
    }

    // If character type criteria is not selected, then proceed with auto-generated random types from stored type-collection
    if (!includeType) {
      var includeAllTypes = window.confirm (
        `Unassigned character types: \nDo you want the password to contain all character types? ` + 
        `\nCANCEL: If you want the types to be randomly selected.`
      );
      // If user do not want the auto-generated password to contain all types, get random types from array of options
      if (!includeAllTypes) {
        // Retrieve types of stored type-collection
        var keys = Object.keys(charCollection);
        // Get random number of types
        var numKeys = getRandomInt(1, keys.length-1);
        for (let i = 0; i < numKeys; i++){
          let int = getRandomInt(0, keys.length-1);
          pswTypes.push(keys[int]);
          // Remove from array after been selected to prevent duplicated types
          keys.splice(int, 1);
        }
      } else {
        // If user want the auto-generated password to contain all types, get all of the types from type-collection
        for (let type in charCollection) {
          pswTypes.push(type);
        }
      } 
    } 
    // User confirm the length and character types of password before display it, otherwise redo the process
    confirmPassword = window.confirm (
      `FINAL STEP: \nThe generated password has ${pswLength} characters, and contains: \n${pswTypes.join(' character(s) \n')} ` + 
      `character(s) \nCANCEL: To start over.`
    );    
  }
  // Get the generated password and display it to the user
  var pswResult = getRandomPassword(pswLength, pswTypes);
  return pswResult;
}

// Generate a random interger where both the maximum and the minimum are inclusive
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); 
}

// Validate the length of password
function validateLength() {
  var lengthInput = ``;

  // Continuously prompt for user input if the length entered is invalid
  while (!(parseInt(lengthInput) >= 8 && parseInt(lengthInput) <= 128)) {
    // If user pressed Cancel, immediately end function
    if (lengthInput === null) {
      return;
    }
    lengthInput = window.prompt (
      `Please enter the length of password (minimum: 8, maximum: 128). \nCANCEL: If you want a random length.`, 8
    );    
  }
  // Get the validated user input for length of characters
  var charLength = parseInt(lengthInput);
  return charLength;
}

// Get the validated length from user input and ask user to confirm it before proceeding
function getLength() {
  var confirmLength = false; 

  while (!confirmLength) {
    var lengthResult = validateLength();
    if (Number.isInteger(lengthResult)) {
      confirmLength = window.confirm (
        `The generated password has ${lengthResult} characters. \nCANCEL: If you want to enter a different length.`
      );
    } else {
      return;
    }
  }
  return lengthResult;
}

// Validate the character types of password
function validateTypes() {
  var typeArray = [];

  // Prompt each type stored in character-collection for user to choose from
  for (let type in charCollection) {
    var includeType = window.confirm (
      `Include ${type.toUpperCase()} characters in the password? \nCANCEL: If you do not want to include this character type.`
    );
    // Add type to array if selected by user
    if (includeType) {
      typeArray.push(type);
    }
  }
  return typeArray;
}

// Get the validated types from user input and ask user to confirm them before proceeding
function getTypes() {
  var confirmType = false;

  while (!confirmType) {
    var typeResult = validateTypes();
    if (typeResult.length > 0) {
      confirmType = window.confirm (
        `The generated password contains: \n${typeResult.join(' character(s) \n')} character(s) \nCANCEL: If you want to re-select.`
      );
    } else {
      window.alert(`At least one character type should be selected.`);
    }
  } 
  return typeResult;
}

// Get secured random password from password criteria
function getRandomPassword(numChars, totalTypes) {
  var totalChars = ``;
  var charResult = [];
  
  for (let i = 0; i < totalTypes.length; i++) {
    if (totalTypes[i] in charCollection) {
      // Get the values of all selected types based on type-collection
      totalChars += charCollection[totalTypes[i]];
      // Makesure the result contains at least one character from each selected type
      let chars = charCollection[totalTypes[i]].split(``);
      let int = getRandomInt(0, chars.length-1);
      charResult.push(chars[int]);  
    }
  }
  // Number of assigned password characters
  var takenNum = charResult.length;
  // Split each character to form an array with characters from all selected types
  var charArray = totalChars.split(``);

  // Fill up the remaining array to meet the length requirement 
  for (let i = 0; i < (numChars-takenNum); i++) {
    let int = getRandomInt(0, charArray.length-1);
    charResult.push(charArray[int]);
  }

  // Since the array started with one from each selected type, shuffle the array to make it random
  for (let i = 0; i < charResult.length; i++) {
    let j = getRandomInt(0, charResult.length-1);
    let k = charResult[i];
    charResult[i] = charResult[j];
    charResult[j] = k;
  }
  var stringResult = charResult.join(``);
  return stringResult;
}

// Add event listener to generate button
generateBtn.addEventListener("click", writePassword);
