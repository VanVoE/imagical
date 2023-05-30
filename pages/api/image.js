// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import fs from 'fs'
import path from 'path'
import formidable from 'formidable'
import { Configuration, OpenAIApi } from "openai"
import sharp from 'sharp'
var mv = require('mv');



const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default async function handler(
  req,
  res
) {
   
 

   const form = new formidable.IncomingForm()
 
   
 
   const data = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err)
      
     
      let oldPath = files.file.filepath
      let newPath = `./public/uploads/original.png`
      mv(oldPath, newPath, function(err) {
      });
     
     
      resolve(newPath)
    })
    })
   

    const resizeImage = (data) => {
      let inputFile = data
      let outputFile = './public/uploads/upload.png'
      sharp(inputFile)
      .resize(1024,1024,{fit:'contain'})
      .toFile(outputFile)
      .then(() => generateImage())
      .catch((err)=>{
        console.log('Error Occured Resizing')
        res.status(500).json({error:err})
      
      })
    }

    resizeImage()

  
  const generateImage = async () =>{
    try{
           const response = await openai.createImageVariation(
            fs.createReadStream('./public/uploads/upload.png'),
           4,
           "1024x1024")
      
          
         
           console.log(response.data)
           res.status(200).json(response.data)
          
          
      }catch (error) {
       if (error.response) {
         console.log(error.response.status);
         console.log(error.response.data);
       } else {
         console.log(error.message);
       }
       res.status(500).json({error:error})
     }

  }


  
  

   

  
   
 

 



}
