import type React from "react";
import type { FC } from "react";

type InputPropTypes = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

const Input: FC<InputPropTypes> = ({ label, ...props }) => {
  return (
    <div className="space-y-2 w-full">
      <label htmlFor={props.name} className="text-sm font-semibold">
        {label}
      </label>
      <input
        id={props.name}
        {...props}
        className="rounded-sm border p-2 w-full focus:outline-none focus:ring-1 focus:ring-primary-purple focus:border-transparent"
      />
    </div>
  );
};

export default Input;
