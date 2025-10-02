import { useEffect, type FC } from "react";
import IconComponent from "../../assets/icons/IconComponent";

type AlertPropTypes = {
  status: "success" | "warning" | "danger" | "info";
  message: string;
  onClose: () => void;
  open: boolean;
  seconds?: number;
};

const Alert: FC<AlertPropTypes> = (props) => {
  const { message, onClose, status, open, seconds = 1 } = props;

  // The alert to close after 1 second
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        onClose();
      }, seconds * 1000);

      return () => clearTimeout(timer);
    }
  }, [onClose, open]);

  const getColorByStatus = (colorStatus: string): string[] => {
    if (colorStatus === "danger")
      return [
        "border-danger-background",
        "text-danger-foreground border-danger-foreground",
      ];
    if (colorStatus === "warning")
      return [
        "border-warning-background",
        "text-warning-foreground border-warning-foreground",
      ];
    if (colorStatus === "info")
      return [
        "border-info-background",
        "text-info-foreground border-info-foreground",
      ];

    return [
      "border-success-background",
      "text-success-foreground border-success-foreground",
    ];
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 h-full w-full items-center justify-center">
      <button
        className="absolute inset-0 h-full w-full bg-black opacity-50"
        onClick={onClose}
      ></button>
      <div className="bg-background animate-slide-in fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rounded-lg px-6 py-5 text-center shadow-lg">
        <div className="flex items-center justify-center gap-3">
          <div
            className={`rounded-full border-6 ${getColorByStatus(status)?.[0]}`}
          >
            <IconComponent
              iconName={status}
              className={`border-6 h-10 w-10 rounded-full ${getColorByStatus(status)?.[1]}`}
            />
          </div>
          <p className={`text-xl font-semibold text-nowrap`}>{message}</p>
        </div>
      </div>
    </div>
  );
};

export default Alert;
