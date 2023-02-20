import NotificationContext from "../../store/notification-context";
import { ReactNode, useContext } from "react";

const statusStyles = {
  success: "bg-deepGreen",
  error: "bg-eRed",
  pending: "bg-deepBlue",
  nochange: "bg-orange-300",
};

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

type Props = {
  title: String;
  message: String;
  status: String;
};

const Notification = (props: Props) => {
  const notificationCtx = useContext(NotificationContext);
  const { title, message, status } = props;

  let statusClasses = "";

  if (status === "success") {
    statusClasses = statusStyles.success;
  }

  if (status === "error") {
    statusClasses = statusStyles.error;
  }

  if (status === "pending") {
    statusClasses = statusStyles.pending;
  }
  if (status === "nochange") {
    statusClasses = statusStyles.nochange;
  }

  return (
    <>
      <div
        className={classNames(
          "flex fixed bottom-0 left-0 h-20 w-full  justify-between items-center text-white py-10 shadow-3xl rounded-tr-none rounded-tl-none",
          statusClasses
        )}
      >
        <h2 className="px-10 text-xl text-white">{title}</h2>
        <p className="px-10">{message}</p>
      </div>
    </>
  );
};

export default Notification;
