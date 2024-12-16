'use client'
 import {signIn,signOut,useSession} from 'next-auth/react'

 export default function Component(){
    const {data:session} = useSession();
    if(session){
        return(
            <>
            Signed in as {session.user.email}<br/>
            <button onClick={()=>signOut()} >Sign out</button>

            </>
        )
    }
    return(
        <>
        Not Signed in <br />
        <button className='bg-orange-500 px-2 my-3 rounded-md' onClick={()=>signIn()}>Sign-in</button>
        </>
    )
 }