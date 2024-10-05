import {
  // getLlama,
  // LlamaChatSession,
  // ChatWrapper,
  Llama3_1ChatWrapper,
  // ChatWrapperSettings, ChatWrapperGenerateContextStateOptions,
  // ChatWrapperGeneratedContextState,
  LlamaText
} from 'node-llama-cpp'

export class MemWrapper extends Llama3_1ChatWrapper {
  // Llama3_1ChatWrapper
  // let wrapperName= "MyCustomChat";

  // let settings = {
  //     ...ChatWrapper.defaultSettings
  // };

  generateContextState({ chatHistory, availableFunctions, documentFunctionParams }) {
    const historyWithFunctions = this.addAvailableFunctionsSystemMessageToHistory(
      chatHistory,
      availableFunctions,
      {
        documentParams: documentFunctionParams
      }
    )

    const texts = historyWithFunctions.map((item, index) => {
      if (item.type === 'system') {
        if (index === 0) return LlamaText([LlamaText.fromJSON(item.text)])

        return LlamaText(['### System\n', LlamaText.fromJSON(item.text)])
      } else if (item.type === 'user') return LlamaText(['### Human\n', item.text])
      else if (item.type === 'model')
        return LlamaText(['### Assistant\n', this.generateModelResponseText(item.response)])

      // ensure that all chat item types are handled,
      // or TypeScript will throw an error
      return item //satisfies never;
    })
    console.log(texts)
    return {
      contextText: LlamaText.joinValues('\n\n', texts),

      // if the model generates any of these texts,
      // the completion will stop, and the text will not
      // be included in the response returned to the user
      stopGenerationTriggers: [LlamaText(['### Human\n'])]
    }
  }
}
