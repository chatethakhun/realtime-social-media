import { PRIMARY_COLOR_CLASS } from "../constants/colors"

interface PrimaryButtonProps {
    disabled?: boolean,
    label: string,
    onClick: () => Promise<void>
}
const PrimaryButton = ({ disabled, label, onClick }: PrimaryButtonProps) => {
    return <button
        className={`bg-${PRIMARY_COLOR_CLASS} p-3 mt-1 rounded text-white mb-3 uppercase w-full disabled:opacity-50`}
        disabled={disabled} 
        onClick={onClick}>
        {label}
    </button>
}

export default PrimaryButton