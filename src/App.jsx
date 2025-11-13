import { useEffect, useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'

const DEFAULT_PROMPT = "A serene cyberpunk city at sunset, with flying cars and holographic advertisements."

function Badge({ children }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-4 py-1.5 text-xs font-semibold tracking-wide text-white shadow shadow-fuchsia-900/30">
      {children}
    </span>
  )
}

function Watermark({ text = 'Powered by AI Power' }) {
  return (
    <div className="pointer-events-none absolute inset-x-3 bottom-3 flex items-center justify-end">
      <span className="rounded-full bg-black/50 px-3 py-1 text-[10px] font-semibold tracking-wide text-white/80 ring-1 ring-white/10 backdrop-blur-sm">
        {text}
      </span>
    </div>
  )
}

function App() {
  const baseUrl = useMemo(() => import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000', [])
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [data, setData] = useState(null)

  const callHyperGenerate = async (p) => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${baseUrl}/api/hyper-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: p })
      })
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError(e.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Auto-run on mount with the default prompt
    callHyperGenerate(DEFAULT_PROMPT)
  }, [])

  const handleShare = async () => {
    const shareText = `AI Power • Hyper-Generate\nPrompt: ${prompt}`
    const shareUrl = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: 'AI Power', text: shareText, url: shareUrl })
      } catch (_) {}
    } else {
      try {
        await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`)
        alert('Share text copied to clipboard!')
      } catch (_) {
        alert('Copy failed. You can share the page URL!')
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0B14] text-slate-200">
      {/* Hero with Spline */}
      <section className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <Spline scene="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        </div>
        {/* Gradient overlay for contrast (non-blocking) */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0A0B14]/10 via-[#0A0B14]/40 to-[#0A0B14]" />
        <div className="relative z-10 mx-auto flex h-full max-w-6xl items-end px-6 pb-10">
          <div>
            <div className="mb-4 flex flex-wrap items-center gap-3">
              <Badge>FREE & UNLIMITED</Badge>
              <span className="text-xs text-slate-400">No credits • No limits • Pure creation</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight">
              AI Power Hyper‑Generate
            </h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              Multi‑modal generation in one click: chat, image, video, audio and motion concepts. Cosmic Dark UI.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 min-w-[280px]">
                <input
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="w-full rounded-lg bg-white/5 px-4 py-3 text-sm text-slate-200 placeholder-slate-400 ring-1 ring-white/10 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
                  placeholder="Enter your vision..."
                />
              </div>
              <button
                onClick={() => callHyperGenerate(prompt)}
                disabled={loading}
                className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-fuchsia-600 to-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-fuchsia-900/30 ring-1 ring-white/10 disabled:opacity-60"
              >
                {loading ? 'Hyper‑Generating…' : 'Hyper‑Generate'}
              </button>
              <button
                onClick={handleShare}
                className="rounded-lg bg-white/5 px-5 py-3 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/10"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <main className="mx-auto max-w-6xl px-6 py-10">
        {error && (
          <div className="mb-8 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        {/* Grid outputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Chat Response */}
          <div className="rounded-xl bg-white/5 p-5 ring-1 ring-white/10">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Chat Response</h2>
              <Badge>AI</Badge>
            </div>
            <p className="whitespace-pre-wrap text-slate-300 text-sm leading-6 min-h-[6rem]">
              {loading && !data ? 'Generating description…' : (data?.chat_response || '—')}
            </p>
          </div>

          {/* Image */}
          <div className="rounded-xl bg-white/5 p-5 ring-1 ring-white/10">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">High‑Res Image</h2>
              <Badge>Powered by AI Power</Badge>
            </div>
            <div className="relative overflow-hidden rounded-lg ring-1 ring-white/10">
              {data?.image_url ? (
                <img src={data.image_url} alt="Generated" className="h-80 w-full object-cover" />
              ) : (
                <div className="flex h-80 w-full items-center justify-center text-slate-400">Waiting…</div>
              )}
              <Watermark />
            </div>
          </div>

          {/* Video */}
          <div className="rounded-xl bg-white/5 p-5 ring-1 ring-white/10">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">1‑Minute Video</h2>
              <Badge>FREE & UNLIMITED</Badge>
            </div>
            <div className="relative overflow-hidden rounded-lg ring-1 ring-white/10">
              {data?.video_url ? (
                <video src={data.video_url} controls className="h-80 w-full object-cover" />
              ) : (
                <div className="flex h-80 w-full items-center justify-center text-slate-400">Waiting…</div>
              )}
              <Watermark />
            </div>
          </div>

          {/* Audio */}
          <div className="rounded-xl bg-white/5 p-5 ring-1 ring-white/10">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">5‑Minute Ambient Audio</h2>
              <Badge>FREE & UNLIMITED</Badge>
            </div>
            <div className="rounded-lg bg-black/30 p-4 ring-1 ring-white/10">
              {data?.audio_url ? (
                <audio src={data.audio_url} controls className="w-full" />
              ) : (
                <div className="py-10 text-center text-slate-400">Waiting…</div>
              )}
            </div>
          </div>

          {/* Image-to-Video Concept */}
          <div className="rounded-xl bg-white/5 p-5 ring-1 ring-white/10 lg:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Image‑to‑Video Concept</h2>
              <Badge>Blueprint</Badge>
            </div>
            <p className="whitespace-pre-wrap text-slate-300 text-sm leading-6">
              {data?.image_to_video_concept || (loading ? 'Composing motion blueprint…' : '—')}
            </p>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-6 text-xs text-slate-400">
          <span>© {new Date().getFullYear()} AI Power</span>
          <span>Cosmic Dark UI • Experimental showcase</span>
        </div>
      </main>
    </div>
  )
}

export default App
