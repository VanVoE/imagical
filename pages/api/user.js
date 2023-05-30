import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
   const user = req.body
  
   
   try {
       const client = await clientPromise;
       const db = client.db("imagical");

       const userInfo = await db
           .collection("users")
           .find({"email": user.user.email})
           .limit(1)
           .toArray()
           
       if(userInfo.length < 1){
        let bodyObject = {
            "email":user.user.email,
            "credit":3 // free 3 credits
        }
        await db.collection("users").insertOne(bodyObject);
        res.json({message: 'User Created'})
       } 
       else {
        res.json(userInfo);
       }
       
   } catch (e) {
       console.error(e);
   }
};