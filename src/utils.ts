import { GoogleGenerativeAI } from "@google/generative-ai";


export async function convertToBase64(image:File){
    const arrayBuffer = await image.arrayBuffer();
    const base64String = bufferToBase64(new Uint8Array(arrayBuffer));
    return base64String;
}

function bufferToBase64(buffer) {
    let binary = '';
    const len = buffer.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(buffer[i]);
    }
    return btoa(binary); // `btoa` converts the binary string to a base64-encoded string
  }

export async function getAiResponse(base64Image, API_KEY: string){
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = "Describe about this image.";
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
