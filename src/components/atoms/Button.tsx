import type React from "react";
import type { FC } from "react";

const Button: FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  className,
  ...props
}) => {
  return (
    <button
      {...props}
      className={`bg-primary-purple flex justify-center items-center gap-1 rounded-sm text-background px-2 py-1 w-fit h-full cursor-pointer hover:scale-102 transition-all duration-300 ${className}`}
    />
  );
};

export default Button;
