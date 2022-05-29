import LeftBar from "./leftbar"

interface ContainerProps {
    children: React.ReactNode
}

const Container = ({ children }: ContainerProps) => {
    return <div className={`container m-auto`}>
        <div className='flex min-h-[100vh]'>
            <div className='hidden md:block md:w-[50px]  lg:w-[200px]'>
                <LeftBar />
            </div>
            <div className='pt-9 border-x-2 border-teal-500 w-[100%] '> {children}</div>
        </div>
    </div>
}

export default Container