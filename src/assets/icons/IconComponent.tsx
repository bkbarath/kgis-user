import type { IconBaseProps, IconType } from "react-icons";
import { BiCheck, BiEdit, BiTrash, BiX } from "react-icons/bi";
import { BsQuestion } from "react-icons/bs";
import { CiWarning } from "react-icons/ci";
import { FaAngleDown, FaInfo, FaRegFileAlt } from "react-icons/fa";
import { IoMdAdd, IoMdArrowBack } from "react-icons/io";
import { IoAlertOutline } from "react-icons/io5";
import { MdDone } from "react-icons/md";
import { PiImage } from "react-icons/pi";

type IconComponentProps = IconBaseProps & {
  iconName: keyof typeof IconList;
};

const IconList: { [key: string]: IconType } = {
  question: BsQuestion,
  cancel: BiX,
  check: BiCheck,
  downArrow: FaAngleDown,
  edit: BiEdit,
  delete: BiTrash,
  file: FaRegFileAlt,
  image: PiImage,
  success: MdDone,
  info: FaInfo,
  warning: CiWarning,
  danger: IoAlertOutline,
  add: IoMdAdd,
  back: IoMdArrowBack
};

const IconComponent = ({
  iconName,
  className,
  ...props
}: IconComponentProps) => {
  const Icon = IconList[iconName] ?? IconList["question"];
  return <Icon className={`h-6 w-6 ${className}`} {...props} />;
};

export default IconComponent;
