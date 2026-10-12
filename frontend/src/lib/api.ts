const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const healthResponse = await fetch(`${apiBaseUrl}/health`, {
      cache: "no-store",
    });

    return healthResponse.ok;
  } catch {
    return false;
  }
}
