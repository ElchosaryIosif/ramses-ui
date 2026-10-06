import { useUI } from '../../store/useUI';

export const Toast = () => {
  const toast = useUI((s) => s.toast);
  return (
    <div className={`toast${toast.visible ? ' show' : ''}${toast.type ? ' ' + toast.type : ''}`}>{toast.message}</div>
  );
};
