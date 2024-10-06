import { GoogleGenerativeAI } from "@google/generative-ai";
import { get_calculate_prompt, get_describe_prompt } from "./prompts";
import { RequestType } from "./types";


export async function convertToBase64(image:File){
    const arrayBuffer = await image.arrayBuffer();
    const base64String = bufferToBase64(new Uint8Array(arrayBuffer));
    return base64String;
}

function bufferToBase64(buffer: Uint8Array) {
    let binary = '';
    const len = buffer.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(buffer[i]);
    }
    return btoa(binary); // `btoa` converts the binary string to a base64-encoded string
  }

export async function getAiResponse(base64Image: string, API_KEY: string, type: RequestType, dict_of_vars_str?: string){
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = (type === RequestType.calculate) ? get_calculate_prompt(dict_of_vars_str) : get_describe_prompt();    
    const image_prompt = {
        inlineData: {
          data: base64Image,
          mimeType: "image/png",
        },
      };
    try{
        const result = await model.generateContent([prompt,image_prompt]);
        console.log(result.response.text());
        return result.response.text()
    }
    catch(e){
        console.log(e);
        return "error fetching data!"
    }
}
