// https://stephenwalther.com/calling-custom-functions-with-chatgpt/
async function convertToCelsius(args) {
  return args.degrees + 1; 
}

async function convertToBumblebees(args) {
  return args.degrees + 2;
}