import { FC, forwardRef, InputHTMLAttributes } from "react";
import { FieldErrors } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


import styles from '../styles/components/inputs.module.scss'
import { PRIMARY_COLOR_CLASS } from "../constants/colors";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    id: string;
    name: string;
    label: string;
    placeholder?: string;
    errorMessage?: FieldErrors;
    icon?: any
}


export const Input: FC<InputProps> = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            id,
            name,
            label,
            placeholder,
            errorMessage,
            icon,
            ...props
        },
        ref
    ) => {
        return (
            <div className="flex flex-col mb-3 text-left">
                <div className={styles.field} >
                    <input
                        id={id}
                        ref={ref}
                        name={name}
                        type='text'
                        aria-label={label}
                        placeholder={placeholder}
                        className={`border ${icon ? 'pr-3 pl-9' : 'px-2'} py-2 w-full focus-visible:border-${PRIMARY_COLOR_CLASS} outline-none rounded`}
                        {...props}
                    />
                    {icon && <FontAwesomeIcon
                        icon={icon}
                    />}
                </div>
                {errorMessage && <span className="mt-1 ml-1 text-red-500 text-sm capitalize">{`${label} can't be blank`}</span>}
            </div>

        );
    }
);

Input.displayName = 'Input'