"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Play } from "lucide-react"
import { LCG, MiddleSquare, MathRandom } from "@/lib/random-algorithms"

export function MonteCarloSimulation() {
  const [iterations, setIterations] = useState(10000)
  const [seed, setSeed] = useState(12345)
  const [results, setResults] = useState<{
    lcg: { pi: number; points: { x: number; y: number; inside: boolean }[] }
    middleSquare: { pi: number; points: { x: number; y: number; inside: boolean }[] }
    mathRandom: { pi: number; points: { x: number; y: number; inside: boolean }[] }
  } | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  useEffect(() => {
    runSimulation()
  }, [])

  const runSimulation = async () => {
    setIsRunning(true)
    setResults(null)

    // Simulate async processing
    await new Promise((resolve) => setTimeout(resolve, 100))

    const maxPoints = 1000 // Limit points for visualization

    // LCG
    const lcg = new LCG(seed)
    let lcgInside = 0
    const lcgPoints: { x: number; y: number; inside: boolean }[] = []

    for (let i = 0; i < iterations; i++) {
      const x = lcg.next()
      const y = lcg.next()
      const inside = x * x + y * y <= 1

      if (inside) lcgInside++
      if (i < maxPoints) lcgPoints.push({ x, y, inside })
    }

    // Middle Square
    const ms = new MiddleSquare(seed)
    let msInside = 0
    const msPoints: { x: number; y: number; inside: boolean }[] = []

    for (let i = 0; i < iterations; i++) {
      const x = ms.next()
      const y = ms.next()
      const inside = x * x + y * y <= 1

      if (inside) msInside++
      if (i < maxPoints) msPoints.push({ x, y, inside })
    }

    // Math.random
    const mr = new MathRandom()
    let mrInside = 0
    const mrPoints: { x: number; y: number; inside: boolean }[] = []

    for (let i = 0; i < iterations; i++) {
      const x = mr.next()
      const y = mr.next()
      const inside = x * x + y * y <= 1

      if (inside) mrInside++
      if (i < maxPoints) mrPoints.push({ x, y, inside })
    }

    setResults({
      lcg: { pi: (lcgInside / iterations) * 4, points: lcgPoints },
      middleSquare: { pi: (msInside / iterations) * 4, points: msPoints },
      mathRandom: { pi: (mrInside / iterations) * 4, points: mrPoints },
    })

    setIsRunning(false)
  }

  const actualPi = Math.PI

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Simulasi Monte Carlo - Estimasi Nilai π</CardTitle>
          <CardDescription>
            Menggunakan random numbers untuk mengestimasi nilai π dengan metode Monte Carlo
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <p className="font-semibold">Cara Kerja:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Generate titik random (x, y) dalam kuadrat [0,1] × [0,1]</li>
              <li>Hitung jarak dari origin: $$d = \sqrt{"{x^2 + y^2}"}$$</li>
              <li>Jika d ≤ 1, titik berada dalam lingkaran kuadran</li>
              <li>Estimasi π = 4 × (titik dalam lingkaran / total titik)</li>
            </ol>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="iterations">Jumlah Iterasi</Label>
              <Input
                id="iterations"
                type="number"
                value={iterations}
                onChange={(e) => setIterations(Number(e.target.value))}
                min={100}
                max={1000000}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="simSeed">Seed Value</Label>
              <Input id="simSeed" type="number" value={seed} onChange={(e) => setSeed(Number(e.target.value))} />
            </div>
            <div className="flex items-end gap-2">
              <Button onClick={runSimulation} disabled={isRunning} className="flex-1">
                <Play className="mr-2 h-4 w-4" />
                {isRunning ? "Running..." : "Run Simulasi"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {results && (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            <ResultCard
              title="LCG"
              estimatedPi={results.lcg.pi}
              actualPi={actualPi}
              points={results.lcg.points}
              color="blue"
            />
            <ResultCard
              title="Middle Square"
              estimatedPi={results.middleSquare.pi}
              actualPi={actualPi}
              points={results.middleSquare.points}
              color="green"
            />
            <ResultCard
              title="Math.random()"
              estimatedPi={results.mathRandom.pi}
              actualPi={actualPi}
              points={results.mathRandom.points}
              color="purple"
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Kesimpulan Simulasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-600">LCG</h4>
                  <p className="text-sm text-muted-foreground">
                    Error: {Math.abs(results.lcg.pi - actualPi).toFixed(6)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Akurasi: {(100 - (Math.abs(results.lcg.pi - actualPi) / actualPi) * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600">Middle Square</h4>
                  <p className="text-sm text-muted-foreground">
                    Error: {Math.abs(results.middleSquare.pi - actualPi).toFixed(6)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Akurasi: {(100 - (Math.abs(results.middleSquare.pi - actualPi) / actualPi) * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-purple-600">Math.random()</h4>
                  <p className="text-sm text-muted-foreground">
                    Error: {Math.abs(results.mathRandom.pi - actualPi).toFixed(6)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Akurasi: {(100 - (Math.abs(results.mathRandom.pi - actualPi) / actualPi) * 100).toFixed(2)}%
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Nilai π sebenarnya: <strong>{actualPi.toFixed(10)}</strong>
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

function ResultCard({
  title,
  estimatedPi,
  actualPi,
  points,
  color,
}: {
  title: string
  estimatedPi: number
  actualPi: number
  points: { x: number; y: number; inside: boolean }[]
  color: "blue" | "green" | "purple"
}) {
  const error = Math.abs(estimatedPi - actualPi)
  const errorPercent = (error / actualPi) * 100

  const colorClasses = {
    blue: "text-blue-600 border-blue-200",
    green: "text-green-600 border-green-200",
    purple: "text-purple-600 border-purple-200",
  }

  return (
    <Card className={`border-2 ${colorClasses[color]}`}>
      <CardHeader>
        <CardTitle className={colorClasses[color]}>{title}</CardTitle>
        <CardDescription>Estimasi π menggunakan {title}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Estimasi π:</span>
            <span className="font-mono font-semibold">{estimatedPi.toFixed(6)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Error:</span>
            <span className="font-mono">{error.toFixed(6)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Error %:</span>
            <span className="font-mono">{errorPercent.toFixed(3)}%</span>
          </div>
        </div>

        <div className="relative w-full aspect-square bg-muted rounded-lg overflow-hidden">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Quarter circle */}
            <path
              d="M 0 100 A 100 100 0 0 1 100 0 L 100 100 Z"
              fill="currentColor"
              className="text-muted-foreground/20"
            />

            {/* Points */}
            {points.map((point, i) => (
              <circle
                key={i}
                cx={point.x * 100}
                cy={100 - point.y * 100}
                r="0.5"
                fill={
                  point.inside ? (color === "blue" ? "#3b82f6" : color === "green" ? "#22c55e" : "#a855f7") : "#ef4444"
                }
                opacity="0.6"
              />
            ))}
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}
