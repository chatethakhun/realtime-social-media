import Head from "next/head"
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "../components/input";
import useAuth from "../hooks/useAuth";

type AuthForm = {
    email: string,
    password: string,
};


const Login = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<AuthForm>();
    const [isSignInForm, setIsSignInFrom] = useState(true)
    const { signUp, signIn } = useAuth()
    const onSubmit: SubmitHandler<AuthForm> = async ({ email, password }) => {
        if(!isSignInForm) {
            await signUp(email, password)
        }
        else {
            await signIn(email, password)
        }   
        
    }

    return (
        <div>
            <Head>
                <title>Login</title>
            </Head>
            <div className="border w-2/5 m-auto text-center p-5">
                <h1 className="text-5xl mb-3">{isSignInForm ? 'Sign In' : 'Sign Up'}</h1>
                <form onSubmit={handleSubmit(onSubmit)} className=" flex flex-col">
                    <Input id="email"
                        placeholder="Email"
                        label="email"
                        errorMessage={errors.email}
                        {...register("email", { required: true })}
                    ></Input>
                    <Input id="password"
                        placeholder="Password"
                        label="password"
                        errorMessage={errors.password}
                        {...register("password", { required: true })}
                    ></Input>

                    <input type="submit" className="bg-teal-500 p-3 rounded text-white mb-3" />

                    <p className="cursor-pointer" onClick={() => {setIsSignInFrom(!isSignInForm)}}>{!isSignInForm ? 'Sign In' : 'Sign Up'}</p>
                </form>
            </div>
        </div>
    )
}


export default Login