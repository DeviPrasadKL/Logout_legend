import { toast } from "react-toastify";

// Notification functions

/**
 * Displays a success toast notification.
 *
 * @param {string} msg - The message to display in the toast.
 */
const notifySuccess = (msg) => toast.success(msg, { toastId: "success" });

/**
 * Displays an error toast notification.
 *
 * @param {string} msg - The message to display in the toast.
 */
const notifyError = (msg) => toast.error(msg, { toastId: "error" });

/**
 * Displays a warning toast notification.
 *
 * @param {string} msg - The message to display in the toast.
 */
const notifyWarn = (msg) => toast.warn(msg, { toastId: "warn" });

// Exporting the functions
export { notifySuccess, notifyError, notifyWarn };
