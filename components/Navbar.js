import React, { useEffect, useState } from 'react'
import axios from 'axios'
import getStripe from '../utils/get-stripejs'
import { useRouter } from 'next/router';



const Navbar = ({userProfile,signIn, signOut, session, userCredit, increaseUserCredit, isBuyingCoins,setIsBuyingCoins}) => {
  const router = useRouter();
 
 
   
  useEffect(() => {
   // Check to see if this is a redirect back from Checkout
   const query = new URLSearchParams(window.location.search);
   
   if(!isBuyingCoins) router.push('/')

   if (query.get('success') && isBuyingCoins) {
   
     
     
     
    
   addCredit()


     
   }

   if (query.get('canceled')) {
    
    
     setIsBuyingCoins(false)
   }
  }, [isBuyingCoins])
  
  const buyCoins = async () => {
    if(!session) signIn()
    
    const stripe = await getStripe()
    const response = await axios.post('/api/checkout_sessions')
   
    if (response.statusCode === 500) {
      console.error(response.message)
      return
    }



    
    setIsBuyingCoins(true)
    stripe.redirectToCheckout({sessionId:response.data.id})
    
   
    
   
  }
  const addCredit = async () => {
    const updatedData = {
      user: userProfile,
      credit: userCredit + 10, // 1 dollar per 10 credits
    }
    const increaseCredit = await axios.post('/api/credit',updatedData)
  .then(()=>{
    
    increaseUserCredit(userCredit)
    setIsBuyingCoins(false)
  })

  }

 
  
  

  return (
    <div className='p-4'>
      
        <div className='max-w-7xl mx-auto flex justify-between items-center'>
                
                <h1 className='text-2xl md:text-4xl font-bold'>I-magical</h1>
              
            
         
               
                <div className='flex space-x-10 text-sm'>
                  
                  
                  <div onClick={buyCoins} className='cursor-pointer'>Buy Coins</div>
                  
                  {session ? <div onClick={() => signOut()} className='cursor-pointer'>Sign Out - {userCredit} Coins</div> : <div onClick={() => signIn()} className='cursor-pointer'>Sign In</div>}
                  
                </div>
           
        </div>
    </div>
  )
}

export default Navbar