import { fileURLToPath } from 'url'
import path from 'path'
import { getLlama, LlamaEmbedding } from 'node-llama-cpp'

import normalize from 'array-normalize'
import fs from 'fs/promises'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const llama = await getLlama()
const model = await llama.loadModel({
  // modelPath: path.join(__dirname, "Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf")
  modelPath: path.join(
    __dirname,
    '../../../../igora/models',
    'Meta-Llama-3.1-8B-Instruct.Q4_K_M.gguf'
  )
})
const context = await model.createEmbeddingContext()

async function embedDocuments(documents) {
  const embeddings = new Map()

  await Promise.all(
    documents.map(async (document) => {
      const embedding = await context.getEmbeddingFor(document)
      embeddings.set(document, embedding)

      console.debug(`${embeddings.size}/${documents.length} documents embedded`)
    })
  )

  return embeddings
}

function findSimilarDocuments(embedding, documentEmbeddings) {
  const similarities = new Map()
  for (const [otherDocument, otherDocumentEmbedding] of documentEmbeddings)
    similarities.set(otherDocument, embedding.calculateCosineSimilarity(otherDocumentEmbedding))

  return Array.from(similarities.keys()).sort((a, b) => similarities.get(b) - similarities.get(a))
}

const documentEmbeddings = await embedDocuments([
  'The sky is clear and blue today',
  'I love eating pizza with extra cheese'
  // 'Dogs love to play fetch with their owners',
  // 'The capital of France is Paris',
  // 'Drinking water is important for staying hydrated',
  // 'Mount Everest is the tallest mountain in the world',
  // 'A warm cup of tea is perfect for a cold winter day',
  // 'The Mont Blanc raise 4807m above sea level',
  // 'Painting is a form of creative expression',
  // 'Not all the things that shine are made of gold',
  // 'Cleaning the house is a good way to keep it tidy'
])

const query = 'What is the tallest mountain on Earth?'
const queryEmbedding = await context.getEmbeddingFor(query)

const similarDocuments = findSimilarDocuments(queryEmbedding, documentEmbeddings)
const topSimilarDocument = similarDocuments[0]

console.log('query:', query)
console.log('Document:', topSimilarDocument)

console.log(similarDocuments)

// Exemple de vecteur de flottants signés entre -1.0 et 1.0
const arr = [-0.8, 0.3, -0.5, 0.9]
// let arr = Array.from(queryEmbedding.vector)

fs.writeFile(
  'vec.json',
  JSON.stringify(arr),
  {
    encoding: 'utf8',
    flag: 'w',
    mode: 0o666
  },
  (err) => {
    if (err) {
      console.log(err)
    }
  }
)
// let vecteur = normalize(arr)
let vecteur = arr
// let vecteur = [0, 1, 1.5, 0.5]
console.log(vecteur)
// Fonction de conversion du vecteur en une chaîne hexadécimale
function convertirVecteurEnHex(vecteur) {
  return vecteur
    .map((valeur) => {
      // Conversion du flottant en entier 16 bits signé (de -32768 à 32767)
      const entier16Bits = Math.round(valeur * 32767)

      // Conversion en hexadécimal avec 4 caractères (ajout de zéros en tête si nécessaire)
      const hex = (entier16Bits & 0xffff).toString(16).padStart(4, '0')

      return hex
    })
    .join('')
}

// Conversion du vecteur
const vecteurHex = convertirVecteurEnHex(vecteur)
console.log(vecteurHex)

fs.writeFile(
  'hex.json',
  vecteurHex,
  {
    encoding: 'utf8',
    flag: 'w',
    mode: 0o666
  },
  (err) => {
    if (err) {
      console.log(err)
    }
  }
)

function convertirHexEnVecteur(vecteurHex) {
  const vecteur = []

  // Découper la chaîne hexadécimale en blocs de 4 caractères
  for (let i = 0; i < vecteurHex.length; i += 4) {
    // Extraire le bloc hexadécimal de 4 caractères
    const hexValue = vecteurHex.slice(i, i + 4)

    // Convertir en entier signé 16 bits
    let entier16Bits = parseInt(hexValue, 16)

    // Si l'entier est supérieur à 32767, ajuster pour obtenir un nombre signé
    if (entier16Bits > 32767) {
      entier16Bits -= 65536
    }

    // Remettre l'entier dans la plage des flottants (-1.0 à 1.0)
    const valeur = entier16Bits / 32767

    // Ajouter au vecteur de résultats
    vecteur.push(valeur)
  }

  return vecteur
}

// Utilisation de la fonction pour convertir la chaîne hexadécimale en vecteur de flottants
const vecteur_restore = convertirHexEnVecteur(vecteurHex)
console.log(vecteur_restore)
