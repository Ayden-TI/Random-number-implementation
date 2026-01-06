"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Play, Trophy, Coins } from "lucide-react"
import { LCG, MiddleSquare, MathRandom } from "@/lib/random-algorithms"

const SYMBOLS = ["🍒", "🍋", "🍊", "🍇", "💎", "7️⃣", "⭐"]
const JACKPOT_SYMBOL = "7️⃣"

interface SpinResult {
  symbols: string[]
  isWin: boolean
  isJackpot: boolean
  winAmount: number
}

interface AlgorithmStats {
  totalSpins: number
  wins: number
  jackpots: number
  totalWinnings: number
  winRate: number
  jackpotRate: number
  recentSpins: SpinResult[]
}

export function JackpotSimulation() {
  const [spins, setSpins] = useState(1000)
  const [seed, setSeed] = useState(12345)
  const [betAmount] = useState(10)
  const [results, setResults] = useState<{
    lcg: AlgorithmStats
    middleSquare: AlgorithmStats
    mathRandom: AlgorithmStats
  } | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [isSpinning, setIsSpinning] = useState(false)

  useEffect(() => {
    runSimulation()
  }, [])

  const spinSlots = (rng: LCG | MiddleSquare | MathRandom): SpinResult => {
    const symbols: string[] = []

    for (let i = 0; i < 3; i++) {
      const randomValue = rng.next()
      const index = Math.floor(randomValue * SYMBOLS.length)
      symbols.push(SYMBOLS[index])
    }

    const isJackpot = symbols.every((s) => s === JACKPOT_SYMBOL)
    const isWin = symbols[0] === symbols[1] && symbols[1] === symbols[2]

    let winAmount = 0
    if (isJackpot) {
      winAmount = betAmount * 100 // Jackpot pays 100x
    } else if (isWin) {
      winAmount = betAmount * 10 // Regular win pays 10x
    }

    return { symbols, isWin, isJackpot, winAmount }
  }

  const runSimulation = async () => {
    setIsRunning(true)
    setIsSpinning(true)
    setResults(null)

    await new Promise((resolve) => setTimeout(resolve, 100))

    const maxRecentSpins = 10

    // LCG Simulation
    const lcg = new LCG(seed)
    const lcgStats: AlgorithmStats = {
      totalSpins: spins,
      wins: 0,
      jackpots: 0,
      totalWinnings: 0,
      winRate: 0,
      jackpotRate: 0,
      recentSpins: [],
    }

    for (let i = 0; i < spins; i++) {
      const result = spinSlots(lcg)
      if (result.isWin) lcgStats.wins++
      if (result.isJackpot) lcgStats.jackpots++
      lcgStats.totalWinnings += result.winAmount
      if (i < maxRecentSpins) lcgStats.recentSpins.push(result)
    }

    lcgStats.winRate = (lcgStats.wins / spins) * 100
    lcgStats.jackpotRate = (lcgStats.jackpots / spins) * 100

    // Middle Square Simulation
    const ms = new MiddleSquare(seed)
    const msStats: AlgorithmStats = {
      totalSpins: spins,
      wins: 0,
      jackpots: 0,
      totalWinnings: 0,
      winRate: 0,
      jackpotRate: 0,
      recentSpins: [],
    }

    for (let i = 0; i < spins; i++) {
      const result = spinSlots(ms)
      if (result.isWin) msStats.wins++
      if (result.isJackpot) msStats.jackpots++
      msStats.totalWinnings += result.winAmount
      if (i < maxRecentSpins) msStats.recentSpins.push(result)
    }

    msStats.winRate = (msStats.wins / spins) * 100
    msStats.jackpotRate = (msStats.jackpots / spins) * 100

    // Math.random Simulation
    const mr = new MathRandom()
    const mrStats: AlgorithmStats = {
      totalSpins: spins,
      wins: 0,
      jackpots: 0,
      totalWinnings: 0,
      winRate: 0,
      jackpotRate: 0,
      recentSpins: [],
    }

    for (let i = 0; i < spins; i++) {
      const result = spinSlots(mr)
      if (result.isWin) mrStats.wins++
      if (result.isJackpot) mrStats.jackpots++
      mrStats.totalWinnings += result.winAmount
      if (i < maxRecentSpins) mrStats.recentSpins.push(result)
    }

    mrStats.winRate = (mrStats.wins / spins) * 100
    mrStats.jackpotRate = (mrStats.jackpots / spins) * 100

    setResults({
      lcg: lcgStats,
      middleSquare: msStats,
      mathRandom: mrStats,
    })

    setIsRunning(false)
    setTimeout(() => setIsSpinning(false), 500)
  }

  const expectedWinRate = (1 / SYMBOLS.length ** 3) * 100
  const expectedJackpotRate = (1 / SYMBOLS.length ** 3) * 100

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-500" />
            Simulasi Mesin Jackpot Slot
          </CardTitle>
          <CardDescription>
            Menggunakan random numbers untuk mensimulasikan mesin slot 3-reel dengan berbagai algoritma
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 space-y-2">
            <p className="font-semibold">Cara Kerja:</p>
            <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
              <li>Setiap spin menghasilkan 3 simbol random dari {SYMBOLS.length} simbol yang tersedia</li>
              <li>Menang jika ketiga simbol sama (Win Rate teoritis: ~{expectedWinRate.toFixed(3)}%)</li>
              <li>
                Jackpot jika ketiga simbol adalah {JACKPOT_SYMBOL} (Jackpot Rate teoritis: ~
                {expectedJackpotRate.toFixed(3)}%)
              </li>
              <li>Jackpot membayar 100x taruhan, win biasa membayar 10x taruhan</li>
            </ol>
            <div className="flex gap-2 items-center pt-2">
              <span className="text-sm font-semibold">Simbol:</span>
              {SYMBOLS.map((symbol, i) => (
                <span key={i} className="text-2xl">
                  {symbol}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="spins">Jumlah Spin</Label>
              <Input
                id="spins"
                type="number"
                value={spins}
                onChange={(e) => setSpins(Number(e.target.value))}
                min={100}
                max={100000}
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
            <StatsCard title="LCG" stats={results.lcg} color="blue" isSpinning={isSpinning} betAmount={betAmount} />
            <StatsCard
              title="Middle Square"
              stats={results.middleSquare}
              color="green"
              isSpinning={isSpinning}
              betAmount={betAmount}
            />
            <StatsCard
              title="Math.random()"
              stats={results.mathRandom}
              color="purple"
              isSpinning={isSpinning}
              betAmount={betAmount}
            />
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Analisis Perbandingan Algoritma</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-600">LCG</h4>
                  <p className="text-sm text-muted-foreground">
                    Win Rate: {results.lcg.winRate.toFixed(3)}% (Expected: ~{expectedWinRate.toFixed(3)}%)
                  </p>
                  <p className="text-sm text-muted-foreground">Jackpot Rate: {results.lcg.jackpotRate.toFixed(3)}%</p>
                  <p className="text-sm text-muted-foreground">Total Wins: ${results.lcg.totalWinnings}</p>
                  <p className="text-sm text-muted-foreground">
                    ROI: {((results.lcg.totalWinnings / (spins * betAmount)) * 100 - 100).toFixed(2)}%
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-600">Middle Square</h4>
                  <p className="text-sm text-muted-foreground">
                    Win Rate: {results.middleSquare.winRate.toFixed(3)}% (Expected: ~{expectedWinRate.toFixed(3)}%)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Jackpot Rate: {results.middleSquare.jackpotRate.toFixed(3)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Total Wins: ${results.middleSquare.totalWinnings}</p>
                  <p className="text-sm text-muted-foreground">
                    ROI: {((results.middleSquare.totalWinnings / (spins * betAmount)) * 100 - 100).toFixed(2)}%
                  </p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-purple-600">Math.random()</h4>
                  <p className="text-sm text-muted-foreground">
                    Win Rate: {results.mathRandom.winRate.toFixed(3)}% (Expected: ~{expectedWinRate.toFixed(3)}%)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Jackpot Rate: {results.mathRandom.jackpotRate.toFixed(3)}%
                  </p>
                  <p className="text-sm text-muted-foreground">Total Wins: ${results.mathRandom.totalWinnings}</p>
                  <p className="text-sm text-muted-foreground">
                    ROI: {((results.mathRandom.totalWinnings / (spins * betAmount)) * 100 - 100).toFixed(2)}%
                  </p>
                </div>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm font-semibold mb-2">Kesimpulan:</p>
                <p className="text-sm text-muted-foreground">
                  Algoritma dengan distribusi yang lebih baik (seperti Math.random) akan menghasilkan win rate yang
                  lebih mendekati nilai teoritis. Algoritma dengan bias atau pola (seperti Middle Square) dapat
                  menghasilkan hasil yang tidak adil untuk pemain atau kasino.
                </p>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

function StatsCard({
  title,
  stats,
  color,
  isSpinning,
  betAmount,
}: {
  title: string
  stats: AlgorithmStats
  color: "blue" | "green" | "purple"
  isSpinning: boolean
  betAmount: number
}) {
  const colorClasses = {
    blue: "text-blue-600 border-blue-200",
    green: "text-green-600 border-green-200",
    purple: "text-purple-600 border-purple-200",
  }

  const totalBet = stats.totalSpins * betAmount
  const profit = stats.totalWinnings - totalBet

  return (
    <Card className={`border-2 ${colorClasses[color]}`}>
      <CardHeader>
        <CardTitle className={`flex items-center gap-2 ${colorClasses[color]}`}>
          <Coins className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>Statistik {stats.totalSpins} spins</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Wins:</span>
            <span className="font-semibold">{stats.wins}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Jackpots:</span>
            <span className="font-semibold text-yellow-600">{stats.jackpots}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Win Rate:</span>
            <span className="font-mono">{stats.winRate.toFixed(3)}%</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Winnings:</span>
            <span className="font-mono text-green-600">${stats.totalWinnings}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Bet:</span>
            <span className="font-mono text-red-600">${totalBet}</span>
          </div>
          <div className="flex justify-between text-sm border-t pt-2">
            <span className="text-muted-foreground font-semibold">Profit/Loss:</span>
            <span className={`font-mono font-semibold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${profit >= 0 ? "+" : ""}
              {profit}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-semibold">10 Spin Terakhir:</p>
          <div className="space-y-1">
            {stats.recentSpins.map((spin, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-2 rounded text-sm ${
                  spin.isJackpot
                    ? "bg-yellow-100 dark:bg-yellow-900/20"
                    : spin.isWin
                      ? "bg-green-100 dark:bg-green-900/20"
                      : "bg-muted"
                }`}
              >
                <div className={`flex gap-1 text-xl ${isSpinning && i === 0 ? "animate-pulse" : ""}`}>
                  {spin.symbols.map((symbol, j) => (
                    <span key={j}>{symbol}</span>
                  ))}
                </div>
                {spin.isJackpot && (
                  <span className="text-xs font-semibold text-yellow-600 flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    JACKPOT! +${spin.winAmount}
                  </span>
                )}
                {spin.isWin && !spin.isJackpot && (
                  <span className="text-xs font-semibold text-green-600">WIN! +${spin.winAmount}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
