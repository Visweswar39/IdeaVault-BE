import { Hono } from 'hono'
import {convertToBase64, getAiResponse} from "./utils";

type Bindings = {
  API_KEY: string
}

const app = new Hono<{Bindings: Bindings}>()

app.post('/run', async (c) => {
  const formdata = await c.req.formData();
  const image = formdata.get("image");
  const base64Image = await convertToBase64(image);
  const res=await getAiResponse(base64Image, c.env.API_KEY);
  return c.text(res);
})

export default app
