/* eslint-disable import/no-extraneous-dependencies */
import { getLlama, LlamaContext, LlamaChatSession, LlamaJsonSchemaGrammar, LlamaGrammar, } from "node-llama-cpp";
export async function createLlamaModel(inputs) {
    const options = {
        gpuLayers: inputs?.gpuLayers,
        modelPath: inputs.modelPath,
        useMlock: inputs?.useMlock,
        useMmap: inputs?.useMmap,
        vocabOnly: inputs?.vocabOnly,
        jsonSchema: inputs?.jsonSchema,
        gbnf: inputs?.gbnf,
    };
    const llama = await getLlama();
    const model = await llama.loadModel(options);
    // console.log(model)
    return model
}
export async function createLlamaContext(model, inputs) {
    const options = {
        batchSize: inputs?.batchSize,
        contextSize: inputs?.contextSize,
        embedding: inputs?.embedding,
        f16Kv: inputs?.f16Kv,
        logitsAll: inputs?.logitsAll,
        model,
        prependBos: inputs?.prependBos,
        seed: inputs?.seed,
        threads: inputs?.threads,
    };
    return await model.createContext(options);
}
export function createLlamaSession(context) {
    return new LlamaChatSession({ context });
}
export function createLlamaJsonSchemaGrammar(schemaString) {
    if (schemaString === undefined) {
        return undefined;
    }
    const schemaJSON = schemaString;
    return new LlamaJsonSchemaGrammar(schemaJSON);
}
export function createCustomGrammar(filePath) {
    return filePath === undefined
        ? undefined
        : new LlamaGrammar({ grammar: filePath });
}
