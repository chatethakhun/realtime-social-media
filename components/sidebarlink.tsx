import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface SideBarLink {
    icon: any,
    label: string,
    onClick: () => {},
    active: boolean
}

const SideBarLink = ({ icon, label, onClick, active  }: SideBarLink) => {
    return <div className={`flex gap-2 px-3 py-2  items-center md:justify-end lg:justify-start ${active && 'bg-teal-500' }`} onClick={onClick}>
        <div className="basis-[100pxpx]"><FontAwesomeIcon icon={icon} className="text-white " /></div>
        <div className="text-white hidden lg:block text-base">{label}</div>
    </div>
}

export default SideBarLink