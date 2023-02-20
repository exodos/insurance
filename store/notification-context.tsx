import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  SetStateAction,
} from "react";

type Props = {
  children: ReactNode;
};
type activeProps = {
  status: String;
};

const NotificationContext = createContext({
  notification: null,
  showNotification: function (notificationData) {},
  hideNotification: function () {},
});

export const NotificationContextProvider = (props: Props) => {
  const [activeNotification, setActiveNotification] = useState<activeProps>();

  useEffect(() => {
    if (
      activeNotification &&
      (activeNotification.status === "success" ||
        activeNotification.status === "error" ||
        activeNotification.status === "nochange")
    ) {
      const timer = setTimeout(() => {
        setActiveNotification(null);
      }, 3000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [activeNotification]);

  const showNotificationHandler = (
    notificationData: SetStateAction<activeProps>
  ) => {
    setActiveNotification(notificationData);
  };

  const hideNotificationHandler = () => {
    setActiveNotification(null);
  };

  const context = {
    notification: activeNotification,
    showNotification: showNotificationHandler,
    hideNotification: hideNotificationHandler,
  };

  return (
    <NotificationContext.Provider value={context}>
      {props.children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
