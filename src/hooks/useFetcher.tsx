"use client";
import { useState } from "react";

export default function useFetcher<T extends any>(defaultData?: any) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const [data, setData] = useState<T>(defaultData);

  type F = () => Promise<T>;

  async function wrapper(f: F) {
    setLoading(true);
    setError(null);
    let response;

    await f()
      .then((res) => {
        setData(res as T);
        response = res;
      })
      .catch((err) => {
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });

    return response as T;
  }

  return {
    loading,
    error,
    data,
    wrapper,
  };
}
