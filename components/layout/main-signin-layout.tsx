import NotificationContext from "@/store/notification-context";
import { useContext } from "react";
import Notification from "../ui/notification";
import SignInLayout from "./signin-layout";

const MainSignInLayout = ({ children }) => {
  const notificationCtx = useContext(NotificationContext);
  const activeNotification = notificationCtx.notification;
  return (
    <>
      <SignInLayout>{children}</SignInLayout>
      {activeNotification && (
        <Notification
          title={activeNotification.title}
          message={activeNotification.message}
          status={activeNotification.status}
        />
      )}
    </>
  );
};

export default MainSignInLayout;
