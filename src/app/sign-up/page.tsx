'use client'
import { signUpSchema } from '@/schemas/signUpSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useDebounceCallback } from 'usehooks-ts';
import axios,{AxiosError} from "axios";
import * as z from "zod";
import { APIResponseType } from '@/helper/APIResponse';
import { FormControl, FormField, FormItem, FormLabel, FormMessage ,Form} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {Loader2} from "lucide-react"
import Link from 'next/link';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
const Page = () => {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('')
    const [isCheckSubmit, setIsCheckSubmit] = useState(false);

    const debounce = useDebounceCallback(setUsername,300);
    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver:zodResolver(signUpSchema),
        defaultValues:{
            username:'',
            email:"",
            password:""
        }
    })
    useEffect(()=>{
        const checkUsernameUniqueness=async ()=>{
            if(username){
                setUsernameMessage('');
                try {
                    const response = await axios.get(`/api/check-username-unique?username=${username}`)
                    setUsernameMessage(response.data.message)  
                } catch (error) {
                    const axiosErr = error as AxiosError<APIResponseType>
                    setUsernameMessage(axiosErr.response?.data.message ??'Error in checking unique username')
                }
            }
        }
        checkUsernameUniqueness();
    },[username])
    const onSubmit =async (data : z.infer<typeof signUpSchema> )=>{
        setIsCheckSubmit(true);
        try {
            const response= await axios.post('/api/sign-up',data)
          if(response.status===201){
            toast({
                title:"Success",
                variant:"default",
                description:response.data.message
            }) 
            router.replace(`/verify-code/${username}`);
            setIsCheckSubmit(false);
          }
                

            
        } catch (error) {
            const axiosErr = error as AxiosError<APIResponseType>
            let errMssg = axiosErr.response?.data.message
            console.error("Sign-up error",axiosErr)
            setIsCheckSubmit(false);
            toast({
                title:"sign-up failed",
                description:errMssg,
                variant:"destructive"
            }) 
        }

    }
  return (
    <div className='min-h-screen flex justify-center items-center bg-gray-100'>
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
            <div className="text-center">
                <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>Join Mystery Message</h1>
                <p className='mb-4'>Sign up to start your anonymous adventure</p>
            </div>
          
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input 
                placeholder="username" 
                {...field} 
                 onChange={(e)=>{
                     field.onChange(e)
                     debounce(e.target.value)   
                 }}
                />
                
              </FormControl>
                {
                   username &&  <p className={`${usernameMessage==='username is unique'?'text-green-500':'text-red-500'}`}>{usernameMessage}</p>
                }
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                placeholder="email" 
                {...field} />
                
              </FormControl>
               
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                placeholder="password" 
                {...field} />
                
              </FormControl>
               
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isCheckSubmit}>
            {isCheckSubmit ?(<><Loader2 className='mr-2 animate-spin h-4 w-4'/> please wait</>):('Sign-up')}
        </Button>
      </form>
    </Form>
    <div className="text-center mt-4">
        <p>
            Already a member?{' '}
            <Link href={'/sign-in'} className='text-blue-600'>
                Sign in
            </Link>
        </p>
    </div>
           
        </div>      
    </div>
  )
}

export default Page