import { useState } from 'react'
import type { TabId } from './types/game'
import { useGame } from './hooks/useGame'
import { GameHUD } from './components/GameHUD'
import { GameDock } from './components/GameDock'
import { SanctuaryScene } from './components/SanctuaryScene'
import { CreatureSheet } from './components/CreatureSheet'
import { EggSheet } from './components/EggSheet'
import { GameScreen } from './components/GameScreen'
import { BreedingPanel } from './components/BreedingPanel'
import { CaretakersPanel } from './components/CaretakersPanel'
import { BuildingsPanel } from './components/BuildingsPanel'
import { HeritagePanel } from './components/HeritagePanel'
import './App.css'

export default function App() {
  const { state, act, reset } = useGame()
  const [screen, setScreen] = useState<TabId>('sanctuary')
  const [selectedMonsterId, setSelectedMonsterId] = useState<string | null>(null)
  const [selectedEggId, setSelectedEggId] = useState<string | null>(null)

  const population = state.monsters.length + state.eggs.length
  const atCapacity = population >= state.sanctuary.capacity
  const overCapacity = population > state.sanctuary.capacity

  const selectedMonster = state.monsters.find((m) => m.id === selectedMonsterId)
  const selectedEgg = state.eggs.find((e) => e.id === selectedEggId)
  const hasNest = state.buildings.find((b) => b.id === 'nest')?.built ?? false
  const hasBreedingDen = state.buildings.find((b) => b.id === 'breedingDen')?.built ?? false
  const hasRehabCenter = state.buildings.find((b) => b.id === 'rehabilitationCenter')?.built ?? false
  const rehabFull = state.rehabOccupants.length >= state.rehabSlots

  const handleReset = () => {
    if (window.confirm('Start a new sanctuary? Current progress will be lost.')) {
      reset()
      setSelectedMonsterId(null)
      setSelectedEggId(null)
      setScreen('sanctuary')
    }
  }

  const closeSheets = () => {
    setSelectedMonsterId(null)
    setSelectedEggId(null)
  }

  const goToSanctuary = () => {
    setScreen('sanctuary')
    closeSheets()
  }

  return (
    <div className="game-shell">
      <GameHUD
        sanctuary={state.sanctuary}
        population={population}
        overCapacity={overCapacity}
        onExplore={() => act({ type: 'EXPLORE' })}
        onReset={handleReset}
      />

      <div className="game-viewport">
        {screen === 'sanctuary' && (
          <SanctuaryScene
            monsters={state.monsters}
            eggs={state.eggs}
            buildings={state.buildings}
            selectedId={selectedMonsterId}
            onSelectMonster={(id) => {
              setSelectedEggId(null)
              setSelectedMonsterId(id)
            }}
            onSelectEgg={(id) => {
              setSelectedMonsterId(null)
              setSelectedEggId(id)
            }}
          />
        )}

        {screen === 'breeding' && (
          <GameScreen
            title="Breeding Den"
            subtitle="Pair adult monsters to forge new bloodlines"
            onClose={goToSanctuary}
          >
            <BreedingPanel
              monsters={state.monsters}
              parentAId={state.breedingPair.parentAId}
              parentBId={state.breedingPair.parentBId}
              hasBreedingDen={hasBreedingDen}
              atCapacity={atCapacity}
              onAction={act}
            />
          </GameScreen>
        )}

        {screen === 'buildings' && (
          <GameScreen
            title="Sanctuary Grounds"
            subtitle="Expand your haven with new structures"
            onClose={goToSanctuary}
          >
            <BuildingsPanel
              buildings={state.buildings}
              gold={state.sanctuary.gold}
              onAction={act}
            />
          </GameScreen>
        )}

        {screen === 'caretakers' && (
          <GameScreen
            title="Caretakers"
            subtitle="The keepers who tend your kin"
            onClose={goToSanctuary}
          >
            <CaretakersPanel caretakers={state.caretakers} monsters={state.monsters} />
          </GameScreen>
        )}

        {screen === 'heritage' && (
          <GameScreen
            title="Heritage Hall"
            subtitle="Bloodlines and sanctuary legacy"
            onClose={goToSanctuary}
            variant="dark"
          >
            <HeritagePanel bloodlines={state.bloodlines} sanctuary={state.sanctuary} />
          </GameScreen>
        )}
      </div>

      <GameDock active={screen} onChange={(tab) => {
        setScreen(tab)
        if (tab !== 'sanctuary') closeSheets()
      }} />

      {selectedMonster && (
        <CreatureSheet
          monster={selectedMonster}
          bloodlineName={
            state.bloodlines.find((b) => b.id === selectedMonster.bloodlineId)?.name ?? 'Unknown'
          }
          caretakers={state.caretakers}
          hasRehabCenter={hasRehabCenter}
          rehabFull={rehabFull}
          onAction={act}
          onClose={() => setSelectedMonsterId(null)}
        />
      )}

      {selectedEgg && (
        <EggSheet
          egg={selectedEgg}
          hasNest={hasNest}
          atCapacity={atCapacity}
          onAction={act}
          onClose={() => setSelectedEggId(null)}
        />
      )}
    </div>
  )
}
