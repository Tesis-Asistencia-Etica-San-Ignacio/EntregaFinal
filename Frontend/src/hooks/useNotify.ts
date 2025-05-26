import { notifySuccess, notifyError,notifyInfo  } from "@/lib/utils/notify";

export function useNotify() {
    return { notifySuccess, notifyError,notifyInfo  };
}
