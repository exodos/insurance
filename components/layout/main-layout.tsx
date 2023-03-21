import { useContext } from "react";
import NotificationContext from "../../store/notification-context";
import Notification from "../ui/notification";
import axios from "axios";
import useSWR from "swr";
import NavBar from "./navbar";
import { useRouter } from "next/router";

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const MainLayout = ({ children }) => {
  const { data, error } = useSWR("/api/links", fetcher);

  const notificationCtx = useContext(NotificationContext);
  const activeNotification = notificationCtx.notification;
  const router = useRouter();

  if (error) {
    router.push("/auth/signin");
  }

  // if (error) return(<div>Failed to load</div>);
  if (!data) return <div>Loading...</div>;

  // console.log(data);

  return (
    <>
      <NavBar navigation={data}>{children}</NavBar>
      {activeNotification && (
        <Notification
          title={activeNotification.title}
          message={activeNotification.message}
          status={activeNotification.status}
        />
      )}
      {/* </div> */}
    </>
  );
};

export default MainLayout;
