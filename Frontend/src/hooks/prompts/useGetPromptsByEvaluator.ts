import { useState, useCallback } from "react";
import { getMyPrompts } from "@/services/promptService";
import type { Prompt } from "@/types/promptType";
import { useNotify } from "@/hooks/useNotify";

const useGetMyPrompts = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);
  const { notifyError } = useNotify();

  const fetchPrompts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getMyPrompts();
      setPrompts(data);
    } catch (err: any) {
      console.error("Error al obtener prompts:", err);
      notifyError({
        title: "Error al obtener prompts",
        description: err?.response?.data?.message,
        icon: "🚫",
        closeButton: true,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  return { prompts, fetchPrompts, loading };
};

export default useGetMyPrompts;
