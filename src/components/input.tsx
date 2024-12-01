"use client";

import { InputHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";

const Input = ({
  name,
  placeholder,
  errors,
  labelIcon,
  ...rest
}: {
  name: string;
  placeholder: string;
  errors?: string[];
  labelIcon?: ReactNode;
} & InputHTMLAttributes<HTMLInputElement>) => {
  const { pending } = useFormStatus();

  return (
    <div className="flex flex-col gap-1">
      <div className="relative flex">
        <label htmlFor={name} className="absolute top-1/2 left-4 -translate-y-1/2 text-stone-600 *:size-5">
          {labelIcon}
        </label>
        <input
          id={name}
          className={`w-full h-12 pl-11 rounded-3xl bg-transparent text-stone-600 border placeholder:text-stone-400 focus:outline-none focus:ring focus:ring-offset-2 transition ${
            errors ? "border-red-500 focus:ring-red-400" : "border-stone-400 focus:ring-stone-300"
          }`}
          name={name}
          placeholder={placeholder}
          disabled={pending}
          {...rest}
        />
      </div>
      <div>
        {errors?.map((error) => (
          <p key={error} className="pt-2 pl-1 text-red-400">
            {error}
          </p>
        ))}
      </div>
    </div>
  );
};
export default Input;
