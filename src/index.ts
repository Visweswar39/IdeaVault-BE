import { Hono } from 'hono'
import {convertToBase64, getAiResponse} from "./utils";
import { RequestType } from './types';

type Bindings = {
  API_KEY: string
}

const app = new Hono<{Bindings: Bindings}>()

app.post('/run', async (c) => {
  const formdata = await c.req.formData();
  const image = formdata.get("image");
  const type = formdata.get("type") as RequestType;
  const dict_of_vars_str = formdata.get("dict_of_vars_str") as string;
  let base64Image:string = ""; 
  if(!image){
    c.status(400);
    return c.json({
      "message": "invalid image"
    })
  } 
  else if(typeof(image) === "string"){
    base64Image = image.split(",")[1];
  } 
  else{
    base64Image = await convertToBase64(image);
  }
  const res=await getAiResponse(base64Image, c.env.API_KEY, type, dict_of_vars_str);
  return c.text(res);
});



export default app
