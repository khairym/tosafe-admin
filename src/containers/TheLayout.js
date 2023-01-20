import React from "react";
import { onMessageListener } from "src/firebase";
import { TheContent, TheSidebar, TheFooter, TheHeader } from "./index";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTranslation } from "react-i18next";
import useSound from "use-sound";

const TheLayout = () => {
  const { i18n } = useTranslation();
  const [playNotificationSound] = useSound("pristine.mp3", {
    volume: 1.0,
  });

  onMessageListener()
    .then((payload) => {
      toast(payload.notification.title, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        rtl: i18n.language === "ar",
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      // console.log(payload);
      playNotificationSound();
    })
    .catch((err) => console.log("failed: ", err));

  return (
    <div className="c-app c-default-layout">
      <TheSidebar />
      <div className="c-wrapper">
        <TheHeader />
        <div className="c-body">
          <ToastContainer />
          <TheContent />
        </div>
        <TheFooter />
      </div>
    </div>
  );
};

export default TheLayout;
