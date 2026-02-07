import {z} from "zod"

export const verifySchema = z.object({
  content : z.string()
  .min(10,{message:"content must be at least of 10 characters"})
  .max(300,{message: 'content must be no longer then 50 characters'})

})