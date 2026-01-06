"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code2 } from "lucide-react"

export function AlgorithmImplementation() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            <CardTitle>Linear Congruential Generator (LCG)</CardTitle>
          </div>
          <CardDescription>Algoritma klasik yang paling umum digunakan</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 font-mono text-sm">
            <pre className="overflow-x-auto">
              {`class LCG {
  seed: number
  a = 1664525
  c = 1013904223
  m = 2 ** 32

  constructor(seed: number) {
    this.seed = seed
  }

  next(): number {
    this.seed = 
      (this.a * this.seed + this.c) 
      % this.m
    return this.seed / this.m
  }
}`}
            </pre>
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-semibold">Formula:</p>
            <p className="text-muted-foreground">$$X_{"{n+1}"} = (aX_n + c) \bmod m$$</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>a = 1664525 (multiplier)</li>
              <li>c = 1013904223 (increment)</li>
              <li>m = 2³² (modulus)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            <CardTitle>Middle Square Method</CardTitle>
          </div>
          <CardDescription>Metode historis oleh John von Neumann</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 font-mono text-sm">
            <pre className="overflow-x-auto">
              {`class MiddleSquare {
  seed: number

  constructor(seed: number) {
    this.seed = seed
  }

  next(): number {
    const squared = 
      (this.seed * this.seed)
        .toString()
        .padStart(8, '0')
    
    this.seed = parseInt(
      squared.substring(2, 6)
    )
    return this.seed / 10000
  }
}`}
            </pre>
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-semibold">Cara Kerja:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Kuadratkan seed</li>
              <li>Ambil digit tengah</li>
              <li>Gunakan sebagai seed baru</li>
              <li>Normalisasi ke [0, 1)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            <CardTitle>Math.random()</CardTitle>
          </div>
          <CardDescription>Built-in JavaScript (xorshift128+)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-muted p-4 font-mono text-sm">
            <pre className="overflow-x-auto">
              {`class MathRandom {
  next(): number {
    return Math.random()
  }
}`}
            </pre>
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-semibold">Karakteristik:</p>
            <ul className="list-disc list-inside space-y-1 text-muted-foreground">
              <li>Implementasi browser-specific</li>
              <li>Biasanya xorshift128+</li>
              <li>Kualitas tinggi</li>
              <li>Tidak dapat di-seed manual</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
