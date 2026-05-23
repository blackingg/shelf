import { useQuery } from "@tanstack/react-query";

export const systemKeys = {
  all: ["system"] as const,
  health: () => [...systemKeys.all, "health"] as const,
};

export interface HealthResponse {
  status?: string;
  healthy?: boolean;
  message?: string;
}

/** Health lives at GET /health (server root), not under /api/v1 */
export function getHealthCheckUrl(): string {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  const root = base.replace(/\/api\/v1\/?$/, "");
  return `${root}/health`;
}

async function fetchHealth(): Promise<HealthResponse> {
  const res = await fetch(getHealthCheckUrl(), { method: "GET" });
  if (!res.ok) {
    throw new Error(`Health check failed (${res.status})`);
  }
  const text = await res.text();
  if (!text) return { status: "ok" };
  try {
    return JSON.parse(text) as HealthResponse;
  } catch {
    return { status: "ok" };
  }
}

export const useHealthQuery = () => {
  return useQuery({
    queryKey: systemKeys.health(),
    queryFn: fetchHealth,
    refetchInterval: 60_000,
    retry: 1,
    staleTime: 30_000,
  });
};

export function isHealthOperational(
  data: HealthResponse | undefined,
  isError: boolean,
): boolean {
  if (isError || !data) return false;
  const status = data.status?.toLowerCase();
  if (status === "ok" || status === "healthy" || status === "operational") {
    return true;
  }
  if (data.healthy === true) return true;
  if (data.healthy === false) return false;
  return true;
}
