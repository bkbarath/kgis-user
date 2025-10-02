import { useEffect, useState } from "react";

const CurrentDateTime: React.FC = () => {
  const [dateTime, setDateTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      const now = new Date();

      const day = String(now.getDate()).padStart(2, "0");
      const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based
      const year = now.getFullYear();

      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // 0 → 12
      const formattedHours = String(hours).padStart(2, "0");

      setDateTime(`${day}-${month}-${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`);
    };

    update(); // initial
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span>{dateTime}</span>;
};

export default CurrentDateTime;
