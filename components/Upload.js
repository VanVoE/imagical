import React, { useState, useEffect } from 'react'
import { Configuration, OpenAIApi } from "openai"
import axios from 'axios'
import {BsFillTrash3Fill} from 'react-icons/bs'
import { saveAs } from 'file-saver'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


 const Upload = ({userCredit, userProfile, decreaseUserCredit}) => {
 const [uploadedImage, setUploadedImage] = useState(null)
 const [file, setFile] = useState(null)
 const [generatedImage, setGeneratedImage] = useState(null)
 const [isGenerating, setIsGenerating] = useState(false)
 const [generatedImages, setGeneratedImages] = useState()
 const [buttonText, setButtonText] = useState('Sign In')
 const [buttonDisabled, setButtonDisabled] = useState(false)
 const [buttonCss, setButtonCss] = useState('py-2 bg-purple-600 mt-10 w-full hover:bg-purple-300')

 const disabled = 'py-2 bg-purple-300 mt-10 w-full'
 const enabled = 'py-2 bg-purple-600 mt-10 w-full hover:bg-purple-300'

 useEffect(() => {
   if(userProfile){
    setButtonText('Generate')
    setButtonDisabled(false)
    setButtonCss(enabled)
   }else{
    setButtonText('Sign In')
    setButtonDisabled(true)
    setButtonCss(disabled)
   }
 }, [userProfile])
 

 const handleUpload = (e) =>
    { 
        const selectedFile = e.target.files[0]
        setFile(selectedFile)
        setUploadedImage(URL.createObjectURL(selectedFile))
        
     
   
    }    

  

    const saveFile = (url) => {
      saveAs(url, "imagical.jpg");
    }
   
    const deleteUpload = () => {
      setFile(null)
      setUploadedImage(null)
    }
   
    

    const handleSubmit = async (e) =>{
        
        e.preventDefault()
       
        
        if(isGenerating || !file || userCredit < 1) return
        
        setIsGenerating(true)
        
        setButtonText('Generating...')
        setButtonDisabled(true)
        setButtonCss(disabled)

        const data = new FormData()


        data.append("file",file)
        
        

        const res = await axios.post('/api/image',data).then((response)=>
        {
          
          setGeneratedImages(response.data.data)

          console.log('fart')
          const updatedData = {
            user: userProfile,
            credit: userCredit - 1, // cost 
          }
          const removeCredit = await axios.post('/api/credit',updatedData)
          .then(()=>{
          
          decreaseUserCredit(userCredit) 
         
        })
          
        }).catch((e)=>{
         
          return console.log(e)
        })
        
        
        
       
        
        
        
        setIsGenerating(false)
        setButtonText('Generate')
        setButtonDisabled(false)
        setButtonCss(enabled)


      

    }

  return (
    <div className='flex flex-col'>
      
      <div className='mt-40 flex flex-col md:flex-row gap-x-20 justify-center'>
        <div className='w-full md:w-[312px] h-[312px] pl-5 pr-5 md:p-0'>
        <form onSubmit={handleSubmit} className='w-full h-full'>
        {uploadedImage ? (
          <div className='relative w-[312px] h-[312px]'>
            <img src={uploadedImage} alt="" className='w-[312px] h-[312px] object-contain'/>
            <div onClick={()=>deleteUpload()} className='cursor-pointer absolute top-2 right-2 bg-purple-600 p-3 rounded-full hover:bg-purple-300'>
              <BsFillTrash3Fill className='text-lg'/>
            </div>
            
          </div>
        )
        
        : (
          
            <label className='flex items-center justify-center w-full h-full border-dashed border-white border'>
            <input type='file' onChange={handleUpload} className='w-0 h-0' required={true}/>
            <h1 className=''>Upload Image</h1>
            </label>
            
          
        )
        }
         
          <button className={buttonCss} disabled={buttonDisabled}>{buttonText}</button>
         
          
        
        
        </form>
        </div>

        <div className='w-full md:w-[50%] flex flex-col gap-y-5 mt-32 md:mt-0 p-5 md:p-0'>
          <h1 className='text-2xl md:text-4xl font-bold'>Let's recreate your image!</h1>
          <p>Upload any image and watch the magic of AI recreate variations of your image!</p>
        </div>
        </div>


        <div className='mt-[15rem] justify-center items-center flex flex-col'>
          {generatedImages && (
            <div>
              <h1 className='text-4xl font-bold'>Your images are done!</h1>
              <h2 className='mt-10'>Please save your images, these aren't stored anywhere.</h2>
          </div>
          )}
          <div className='flex gap-x-5 mt-20'>
          
          { generatedImages && generatedImages.map((item,index)=>
         
            <img key={index} src={item.url} alt="" onClick={()=>saveFile(item.url)} download={item.url} className='w-full h-[312px] object-contain'/>
           
          )}
          </div>
        </div>
       
        
    </div>
  )
}

export default Upload