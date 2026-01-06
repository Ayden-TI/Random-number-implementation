"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart3 } from "lucide-react"
import { LCG, MiddleSquare, MathRandom } from "@/lib/random-algorithms"

export function AlgorithmComparison() {
  const [sampleSize, setSampleSize] = useState(10000)
  const [seed, setSeed] = useState(12345)
  const [distributions, setDistributions] = useState<{
    lcg: number[]
    middleSquare: number[]
    mathRandom: number[]
  } | null>(null)

  useEffect(() => {
    generateDistributions()
  }, [])

  const generateDistributions = () => {
    const bins = 20
    const lcgDist = new Array(bins).fill(0)
    const msDist = new Array(bins).fill(0)
    const mrDist = new Array(bins).fill(0)

    const lcg = new LCG(seed)
    const ms = new MiddleSquare(seed)
    const mr = new MathRandom()

    for (let i = 0; i < sampleSize; i++) {
      const lcgVal = lcg.next()
      const msVal = ms.next()
      const mrVal = mr.next()

      lcgDist[Math.floor(lcgVal * bins)]++
      msDist[Math.floor(msVal * bins)]++
      mrDist[Math.floor(mrVal * bins)]++
    }

    setDistributions({
      lcg: lcgDist,
      middleSquare: msDist,
      mathRandom: mrDist,
    })
  }

  const calculateStats = (dist: number[]) => {
    const mean = dist.reduce((a, b) => a + b, 0) / dist.length
    const variance = dist.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / dist.length
    const stdDev = Math.sqrt(variance)
    return { mean: mean.toFixed(2), stdDev: stdDev.toFixed(2) }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pengaturan Perbandingan</CardTitle>
          <CardDescription>Atur parameter untuk membandingkan distribusi algoritma</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="sampleSize">Jumlah Sample</Label>
              <Input
                id="sampleSize"
                type="number"
                value={sampleSize}
                onChange={(e) => setSampleSize(Number(e.target.value))}
                min={100}
                max={100000}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seed">Seed Value</Label>
              <Input id="seed" type="number" value={seed} onChange={(e) => setSeed(Number(e.target.value))} />
            </div>
            <div className="flex items-end">
              <Button onClick={generateDistributions} className="w-full">
                <BarChart3 className="mr-2 h-4 w-4" />
                Generate Distribusi
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {distributions && (
        <div className="grid gap-6 md:grid-cols-3">
          <DistributionCard
            title="Linear Congruential Generator"
            distribution={distributions.lcg}
            color="bg-blue-500"
            stats={calculateStats(distributions.lcg)}
          />
          <DistributionCard
            title="Middle Square Method"
            distribution={distributions.middleSquare}
            color="bg-green-500"
            stats={calculateStats(distributions.middleSquare)}
          />
          <DistributionCard
            title="Math.random()"
            distribution={distributions.mathRandom}
            color="bg-purple-500"
            stats={calculateStats(distributions.mathRandom)}
          />
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Analisis Perbandingan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <h4 className="font-semibold text-blue-600">LCG</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ Cepat dan efisien</li>
                <li>✓ Distribusi uniform yang baik</li>
                <li>✗ Periode terbatas</li>
                <li>✗ Pola dapat diprediksi</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">Middle Square</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ Sederhana dan mudah dipahami</li>
                <li>✗ Periode sangat pendek</li>
                <li>✗ Dapat stuck di 0</li>
                <li>✗ Distribusi tidak uniform</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-purple-600">Math.random()</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ Kualitas sangat tinggi</li>
                <li>✓ Distribusi uniform sempurna</li>
                <li>✓ Periode sangat panjang</li>
                <li>✗ Tidak dapat di-seed</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function DistributionCard({
  title,
  distribution,
  color,
  stats,
}: {
  title: string
  distribution: number[]
  color: string
  stats: { mean: string; stdDev: string }
}) {
  const maxValue = Math.max(...distribution)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>
          Mean: {stats.mean} | Std Dev: {stats.stdDev}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-1 h-48">
          {distribution.map((value, index) => (
            <div
              key={index}
              className="flex-1 relative group"
              style={{
                height: `${(value / maxValue) * 100}%`,
              }}
            >
              <div className={`${color} h-full rounded-t transition-all hover:opacity-80`} />
              <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-popover text-popover-foreground px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {value}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>0.0</span>
          <span>0.5</span>
          <span>1.0</span>
        </div>
      </CardContent>
    </Card>
  )
}
