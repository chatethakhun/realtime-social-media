import { FC, forwardRef } from "react";
import { FieldErrors } from "react-hook-form";

interface InputProps {
    id: string;
    name: string;
    label: string;
    placeholder?: string;
    errorMessage?: FieldErrors
}


export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            id,
            name,
            label,
            placeholder,
            errorMessage,
            ...props
        },
        ref
    ) => {
        return (
            <div className="flex flex-col mb-3 text-left">
                <input
                    id={id}
                    ref={ref}
                    name={name}
                    type='text'
                    aria-label={label}
                    placeholder={placeholder}
                    className="border px-3 py-2 "
                    {...props}
                />
                {errorMessage && <span className="mt-1 ml-1 text-red-500 text-sm capitalize">{`${label} can't be blank`}</span>}
            </div>

        );
    }
);