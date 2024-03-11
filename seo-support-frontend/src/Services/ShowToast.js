import { toast } from "wc-toast";

const ShowToast = {
  handleSuccessToast: function (message) {
    toast.success(message, { duration: 5000, closeable: true });
  },
  handleErrorToast: function (message) {
    if (Array.isArray(message)) {
      message = message[0];
    }
    toast.error(message, { duration: 5000, closeable: true });
  },
};

export default ShowToast;
