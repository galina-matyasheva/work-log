import "./Notification.css";

import { useEffect } from "react";

type Props = {
  type: "success" | "error";
  message: string;
  onClose: () => void;
};

export const Notification = ({ type, message, onClose }: Props) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`notification notification--${type}`} onClick={onClose}>
      {message}
    </div>
  );
};
