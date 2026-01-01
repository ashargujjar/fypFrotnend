import { toast } from "react-toastify";

const baseOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const toastSuccess = (message) =>
  toast.success(message, {
    ...baseOptions,
  });

export const toastError = (message) =>
  toast.error(message, {
    ...baseOptions,
  });

export const toastInfo = (message) =>
  toast.info(message, {
    ...baseOptions,
  });

export const toastWarning = (message) =>
  toast.warn(message, {
    ...baseOptions,
  });
