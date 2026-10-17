import { useEffect, useState } from "react";

/** Simulates an async "load" so skeleton states are demonstrable in the prototype. */
export function useSimulatedLoading(delay = 750) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return loading;
}
