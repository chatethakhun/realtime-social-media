import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface SideBarLink {
    icon: any,
    label: string,
    onClick: () => {}
}

const SideBarLink = ({ icon, label, onClick }: SideBarLink) => {
    return <div className="ml-1 flex gap-2 items-center md:justify-end lg:justify-start" onClick={onClick}>
        <div className="basis-[100pxpx]"><FontAwesomeIcon icon={icon} className="text-white " /></div>
        <div className="text-white hidden lg:block text-xs">{label}</div>
    </div>
}

export default SideBarLink