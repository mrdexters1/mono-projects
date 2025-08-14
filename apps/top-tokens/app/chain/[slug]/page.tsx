import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";

export const revalidate = 60000;

async function fetchTrendingRaw(chain: string, limit = 100): Promise<{ data: unknown; fetchedAt: string }> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort("timeout"), 8000);

  try {
    const url =
      `https://deep-index.moralis.io/api/v2.2/tokens/trending` + `?chain=${encodeURIComponent(chain)}&limit=${limit}`;

    const res = await fetch(url, {
      headers: {
        accept: "application/json",
        "X-API-Key": process.env.MORALIS_API_KEY,
      },

      next: { revalidate: revalidate, tags: [`trending:${chain}`] },
      signal: ctrl.signal,
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Moralis ${res.status} ${res.statusText}: ${body.slice(0, 300)}`);
    }

    const data = await res.json();
    return { data, fetchedAt: new Date().toISOString() }; // отметим момент «сетевого» запроса
  } catch (err: any) {
    if (err?.name === "AbortError") throw new Error("Moralis request timed out (8s)");
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

// оборачиваем в Data Cache; ключ включает chain+limit
function getTrending(chain: string, limit = 3) {
  return unstable_cache(() => fetchTrendingRaw(chain, limit), [`trending:${chain}:${limit}`], {
    revalidate: revalidate,
    tags: [`trending:${chain}`],
  })();
}

export default async function ChainPage({ params }: { params: Promise<{ slug?: string }> }) {
  const { slug } = await params;
  if (!slug) notFound();
  const chain = slug;

  console.log("chain", chain);
  const { data, fetchedAt } = await getTrending(chain);

  const fetched = new Date(fetchedAt);
  const ageSec = Math.max(0, Math.floor((Date.now() - fetched.getTime()) / 1000));
  const source = ageSec < 2 ? "network (fresh)" : "cache (ISR/Data Cache)";

  return (
    <main className="p-6 space-y-3">
      <h1 className="text-2xl font-semibold">Trending tokens — {chain}</h1>

      <div className="text-sm opacity-70">
        <div>
          Source: <b>{source}</b>
        </div>
        <div>Fetched at: {fetched.toLocaleString()}</div>
        <div>Age: {ageSec}s (revalidate every 60000s)</div>
      </div>

      <pre className="text-xs opacity-80">{JSON.stringify(data, null, 2)}</pre>
    </main>
  );
}
