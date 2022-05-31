import { faHamburger } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useRef, useState } from "react"
import useOnClickOutside from "../hooks/useOnClickOutside"
import LeftBar from "./leftbar"

interface ContainerProps {
    children: React.ReactNode
}

const Container = ({ children }: ContainerProps) => {
    const [openMenu, setOpenMenu] = useState(false)
    const menuRef = useRef(null)

    useOnClickOutside(menuRef, () => setOpenMenu(!openMenu))

    return <div className={`container m-auto`}>
        <div className='flex min-h-[100vh]'>
            <div className={`hidden md:block md:w-[50px]  lg:w-[200px]`}>
                <LeftBar />
            </div>
            <div className='pt-9 border-x-2 border-teal-500 w-[100%] '> {children}</div>
            {
                    openMenu && <div className="absolute bottom-[80px] left-[20px]" ref={menuRef}>
                        <LeftBar />
                    </div>
            }
            <div className="block md:hidden absolute bottom-[20px] left-[20px]" >
                <button className="bg-teal-500 px-3 py-2" onClick={() => setOpenMenu(!openMenu)}>
                    <FontAwesomeIcon icon={faHamburger} />
                </button>
            </div>

        </div>
    </div>
}

export default Container