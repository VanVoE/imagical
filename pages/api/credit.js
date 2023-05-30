import clientPromise from "../../lib/mongodb";

export default async (req, res) => {
   const {user,credit} = req.body

   
   try {
       const client = await clientPromise;
       const db = client.db("imagical");

       const query = {
        "email" : user
       }

       const newValue = {
        $set: {"credit": credit}
       }

       const post = await db.collection("users").updateOne(query,newValue)
           
  
       res.json(post)
   } catch (e) {
       console.error(e);
   }
};