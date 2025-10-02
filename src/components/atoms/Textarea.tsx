import type { FC } from "react";

type InputPropTypes = React.HTMLProps<HTMLTextAreaElement> & {
  label?: string;
};

const Textarea: FC<InputPropTypes> = ({ label, ...props }) => {
  return (
    <div key={props.name} className="w-full">
      <label htmlFor={props.name} className="block text-sm font-medium">
        {label}
      </label>
      <textarea id={props.name} {...props} className="border w-full p-2" />
    </div>
  );
};

export default Textarea;
