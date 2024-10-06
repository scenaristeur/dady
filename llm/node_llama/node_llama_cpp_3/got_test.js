import got from 'got';
import fs from 'fs/promises'

const url = 'https://solidproject.org/TR/protocol#n3-patch';
const data = await got(url).text();
console.log(data)

let file = await fs.writeFile('./memory/'+Date.now(), JSON.stringify(data), 'utf8')
console.log(file)