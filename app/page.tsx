"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlgorithmComparison } from "@/components/algorithm-comparison"
import { JackpotSimulation } from "@/components/jackpot-simulation"
import { AlgorithmImplementation } from "@/components/algorithm-implementation"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Implementasi & Perbandingan Algoritma Random Number</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Eksplorasi berbagai algoritma pembangkit bilangan acak dengan visualisasi dan simulasi interaktif
          </p>
        </div>

        <Tabs defaultValue="implementation" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="implementation">Implementasi Algoritma</TabsTrigger>
            <TabsTrigger value="comparison">Perbandingan</TabsTrigger>
            <TabsTrigger value="simulation">Simulasi Mesin Jackpot</TabsTrigger>
          </TabsList>

          <TabsContent value="implementation" className="space-y-6">
            <AlgorithmImplementation />
          </TabsContent>

          <TabsContent value="comparison" className="space-y-6">
            <AlgorithmComparison />
          </TabsContent>

          <TabsContent value="simulation" className="space-y-6">
            <JackpotSimulation />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
