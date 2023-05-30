import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Navbar from '../components/Navbar'
import Upload from '../components/Upload'
import Footer from '../components/Footer'
import { useSession, signIn, signOut } from "next-auth/react"
import { useEffect } from 'react'
import useAuthStore from '../store/store';
import axios from 'axios'


const Home: NextPage = () => {  
  const { data: session } = useSession()
  const {userProfile, userCredit, setUserProfile, setUserCredit, removeUser, decreaseUserCredit,increaseUserCredit,isBuyingCoins,setIsBuyingCoins} = useAuthStore()
  
  useEffect(() => {
    if(userProfile) return
    if(session){
     authenticateUser()
    
    } else {
      removeUser()
    }
  
    
   }, [session])

   const authenticateUser = async () => {
    
    await axios.post('/api/user',session)
    .then((res)=>{
      setUserProfile(res.data[0].email) 
      setUserCredit(res.data[0].credit)
      
    })
   }
  
  
  

  return (
    <div className="">
      <Head>
        <title>Imagical</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
    
      <Navbar userProfile={userProfile} signIn={signIn} signOut={signOut} session={session} userCredit={userCredit} increaseUserCredit={increaseUserCredit} setIsBuyingCoins={setIsBuyingCoins} isBuyingCoins={isBuyingCoins}/>
      <main className='max-w-7xl mx-auto'>
        <Upload userCredit={userCredit} userProfile={userProfile} decreaseUserCredit={decreaseUserCredit}/>
      </main>
      <Footer/>
    
      
    </div>
  )
}

export default Home
