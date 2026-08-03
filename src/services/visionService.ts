export async function generateVision(prompt: string): Promise<string | null> {
  try {
    const res = await fetch("/api/gemini/generateVision", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!res.ok) {
      throw new Error(`Server returned status ${res.status}`);
    }

    const data = await res.json();
    return data.imageUrl || null;
  } catch (err) {
    console.error("Vision generation (proxy client) failed:", err);
    return null;
  }
}
