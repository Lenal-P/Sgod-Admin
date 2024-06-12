import axios from 'axios';
import toast from "react-hot-toast";

export function handleAxiosError(error: unknown): void {
  if (axios.isAxiosError(error)) {
    const messages = error.response?.data?.message;
    if (Array.isArray(messages)) {
      messages.forEach((msg: string) => toast.error(msg));
    } else if (typeof messages === 'string') {
      toast.error(messages);
    } else {
      toast.error("An unknown error occurred");
    }
  } else {
    toast.error("An unexpected error occurred");
  }
}

