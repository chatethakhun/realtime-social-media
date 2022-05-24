import Head from "next/head"
import { useForm, SubmitHandler } from "react-hook-form";
import useAuth from "../hooks/useAuth";

type Inputs = {
    email: string,
    password: string,
};


export default () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
    const { signUp } =  useAuth()
    const onSubmit: SubmitHandler<Inputs> = async ( { email, password }) => {
        await signUp(email, password)
    }

    return (
        <div className="container m-auto">
            <Head>
                <title>Login</title>
            </Head>
            <div className="border w-2/5 m-auto text-center p-5">
                <h1 className="text-5xl mb-3">Login</h1>
                <form onSubmit={handleSubmit(onSubmit)} className=" flex flex-col">
                    {/* register your input into the hook by invoking the "register" function */}
                    <input
                        {...register("email", { required: true })}
                        placeholder="Email"
                        className="border px-3 py-2 mb-3" />

                    {/* include validation with required or other standard HTML validation rules */}
                    <input {...register("password", { required: true })}
                        placeholder="Password"
                        className="border px-3 py-2 mb-3" />
                    {/* errors will return when field validation fails  */}
                    {errors.password && <span>This field is required</span>}

                    <input type="submit" className="bg-teal-500 p-3 rounded text-white mb-3" />
                </form>
            </div>
        </div>
    )
}
