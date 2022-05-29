import SideBarLink from "./sidebarlink"
import { faHome, faPowerOff, faUser } from "@fortawesome/free-solid-svg-icons"
import  useAuth from '../hooks/useAuth'
import { useRouter } from "next/router"
import useConfrim from "../hooks/useConfirm"

const LeftBar = () => {
    const { logout } = useAuth()
    const { confirm } = useConfrim()
    const router = useRouter()
    return <div className="text-right pr-5 mt-5 flex flex-col gap-5 cursor-pointer">
        <SideBarLink icon={faHome} label='Home' onClick={() => router.push('/')}/>
        <SideBarLink icon={faUser} label='Profile' onClick={() => router.push('/profile')}/>
        <SideBarLink icon={faPowerOff} label='Sign Out' onClick={async () =>  {
            const isConfirm = await confirm()
            if(isConfirm) {
                logout()
            }
        }}/>
    </div>
}

export default LeftBar