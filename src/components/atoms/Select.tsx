import type React from "react";
import type { FC } from "react";
import type { OptionItem } from "../../lib/types/common.type";

type SelectPropType = React.HTMLProps<HTMLSelectElement> & {
  label?: string;
  isAllMenu?: boolean;
  addPlaceHolderValue?: boolean;
  options?: OptionItem[];
};

const Select: FC<SelectPropType> = ({
  label,
  isAllMenu,
  addPlaceHolderValue,
  options,
  ...props
}) => {
  return (
    <div className="w-full space-y-2">
      <label
        htmlFor={props.name}
        className="text-sm font-semibold"
      >
        {label}
      </label>
      <select
        {...props}
        id={props.name}
        className="border-1 rounded-sm p-2 w-full"
      >
        {addPlaceHolderValue && (
          <option value="" disabled>
            --Select-an-Option--
          </option>
        )}
        {isAllMenu && <option value="All">All</option>}
        {/* options */}
        {(options ?? []).map((item) => (
          <option value={item.value}>{item.label}</option>
        ))}
      </select>
    </div>
  );
};

export default Select;
