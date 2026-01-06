export class LCG {
  private seed: number
  private readonly a = 1664525
  private readonly c = 1013904223
  private readonly m = 2 ** 32

  constructor(seed: number) {
    this.seed = seed
  }

  next(): number {
    this.seed = (this.a * this.seed + this.c) % this.m
    return this.seed / this.m
  }

  reset(seed: number) {
    this.seed = seed
  }
}

export class MiddleSquare {
  private seed: number

  constructor(seed: number) {
    this.seed = seed % 10000 // Keep it 4 digits
  }

  next(): number {
    const squared = (this.seed * this.seed).toString().padStart(8, "0")
    this.seed = Number.parseInt(squared.substring(2, 6))

    // Prevent getting stuck at 0
    if (this.seed === 0) {
      this.seed = 1234
    }

    return this.seed / 10000
  }

  reset(seed: number) {
    this.seed = seed % 10000
  }
}

export class MathRandom {
  next(): number {
    return Math.random()
  }
}
