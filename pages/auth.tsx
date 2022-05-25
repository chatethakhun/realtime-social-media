import Head from "next/head"
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Input } from "../components/input";
import useAuth from "../hooks/useAuth";
import styles from '../styles/pages/login.module.scss'
import {
    faUser,
    faKey
} from "@fortawesome/free-solid-svg-icons";
import { PRIMARY_COLOR_CLASS } from "../constants/colors";

interface AuthForm {
    email: string,
    password: string,
};


const Auth = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<AuthForm>();
    const [isSignInForm, setIsSignInFrom] = useState(true)
    const { signUp, signIn, loading } = useAuth()
    const onSubmit: SubmitHandler<AuthForm> = async ({ email, password }) => {
        if (!isSignInForm) {
            await signUp(email, password)
        }
        else {
            await signIn(email, password)
        }

    }

    return (
        <div className="flex h-screen">
            <Head>
                <title>Authenticate</title>
            </Head>
            <div className={`${styles.bgimage} w-1/2 hidden lg:block`}></div>
            <div className="w-full lg:w-1/2 m-auto text-center p-5">
                <form onSubmit={handleSubmit(onSubmit)} className=" flex flex-col w-full lg:w-2/5 m-auto shadow-xl">
                    <div className={`uppercase text-white bg-${PRIMARY_COLOR_CLASS} h-16 mb-5 text-2xl flex justify-center items-center`}>
                        {`member ${isSignInForm ? 'Sign In' : 'Sign Up'}`}
                    </div>
                    <div className="p-4 pb-0 pt-1">
                        <Input id="email"
                            placeholder="Email"
                            label="email"
                            errorMessage={errors.email}
                            icon={faUser}
                            {...register("email", { required: true })}
                        ></Input>
                        <Input id="password"
                            placeholder="Password"
                            label="password"
                            errorMessage={errors.password}
                            icon={faKey}
                            {...register("password", { required: true })}
                        ></Input>
                        <button
                            className={`bg-${PRIMARY_COLOR_CLASS} p-3 mt-1 rounded text-white mb-3 uppercase w-full disabled:opacity-50`}
                            disabled={loading === true}>
                            {isSignInForm ? 'Sign In' : 'Sign Up'}
                        </button>
                    </div>

                    <div className="flex gap-1 justify-center mb-3">
                        {`${isSignInForm ? `Don't` : 'Already'} Have an Account?`}
                        <p className={`cursor-pointer text-${PRIMARY_COLOR_CLASS}`} onClick={() => { setIsSignInFrom(!isSignInForm) }}>{!isSignInForm ? 'Sign In' : 'Sign Up'}</p>
                    </div>

                </form>
            </div>
        </div>
    )
}


export default Auth