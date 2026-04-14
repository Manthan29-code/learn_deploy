import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { removeNotification } from "../../store/slices/notificationsSlice";

const toastTone = {
  follow: "border-sky-300/30 bg-sky-500/15 text-sky-100",
  like: "border-rose-300/30 bg-rose-500/15 text-rose-100",
  followed_user_note: "border-emerald-300/30 bg-emerald-500/15 text-emerald-100",
  info: "border-white/20 bg-slate-800/85 text-slate-100",
};

const ToastItem = ({ id, type, message }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      dispatch(removeNotification(id));
    }, 4500);

    return () => window.clearTimeout(timerId);
  }, [dispatch, id]);

  return <div className={`rounded-xl border px-3 py-2 text-sm shadow-lg backdrop-blur ${toastTone[type] || toastTone.info}`}>{message}</div>;
};

const NotificationToasts = () => {
  const notifications = useSelector((state) => state.notifications.items);

  if (!notifications.length) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[70] flex w-[min(340px,90vw)] flex-col gap-2">
      {notifications.map((item) => (
        <ToastItem key={item.id} id={item.id} type={item.type} message={item.message} />
      ))}
    </div>
  );
};

export default NotificationToasts;
