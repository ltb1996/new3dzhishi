import type { GraphResponse } from "../types/knowledge";

export async function fetchGraphData(): Promise<GraphResponse> {
  const response = await fetch("/api/graph");

  if (!response.ok) {
    throw new Error(`Failed to load graph data: ${response.status}`);
  }

  return response.json() as Promise<GraphResponse>;
}
