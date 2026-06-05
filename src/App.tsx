import { useState } from 'react'
import type { TabId } from './types/game'
import { useGame } from './hooks/useGame'
import { Header } from './components/Header'
import { ResourcesBar } from './components/ResourcesBar'
import { MonsterCard } from './components/MonsterCard'
import { MonsterDetail } from './components/MonsterDetail'
import { EggPanel } from './components/EggPanel'
import { BreedingPanel } from './components/BreedingPanel'
import { CaretakersPanel } from './components/CaretakersPanel'
import { BuildingsPanel } from './components/BuildingsPanel'
import { HeritagePanel } from './components/HeritagePanel'
import './App.css'

const TABS: { id: TabId; label: string }[] = [
  { id: 'sanctuary', label: 'Sanctuary' },
  { id: 'monsters', label: 'Monsters' },
  { id: 'breeding', label: 'Breeding' },
  { id: 'caretakers', label: 'Caretakers' },
  { id: 'buildings', label: 'Buildings' },
  { id: 'heritage', label: 'Heritage' },
]

export default function App() {
  const { state, act, reset } = useGame()
  const [tab, setTab] = useState<TabId>('sanctuary')
  const [selectedId, setSelectedId] = useState<string | null>(
    state.monsters[0]?.id ?? null,
  )

  const population = state.monsters.length + state.eggs.length
  const atCapacity = population >= state.sanctuary.capacity
  const overCapacity = population > state.sanctuary.capacity

  const selectedMonster = state.monsters.find((m) => m.id === selectedId)
  const hasNest = state.buildings.find((b) => b.id === 'nest')?.built ?? false
  const hasBreedingDen = state.buildings.find((b) => b.id === 'breedingDen')?.built ?? false
  const hasRehabCenter = state.buildings.find((b) => b.id === 'rehabilitationCenter')?.built ?? false
  const rehabFull = state.rehabOccupants.length >= state.rehabSlots

  const handleReset = () => {
    if (window.confirm('Start a new sanctuary? Current progress will be lost.')) {
      reset()
      setSelectedId(null)
      setTab('sanctuary')
    }
  }

  return (
    <div className="app">
      <Header
        sanctuary={state.sanctuary}
        population={population}
        onExplore={() => act({ type: 'EXPLORE' })}
        onReset={handleReset}
      />

      <ResourcesBar food={state.sanctuary.food} treats={state.sanctuary.treats} />

      {overCapacity && (
        <div className="alert alert--warn">
          Over capacity! Monsters are at risk of neglect. Release creatures or expand your sanctuary.
        </div>
      )}

      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`tabs__btn ${tab === t.id ? 'tabs__btn--active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="main">
        {tab === 'sanctuary' && (
          <div className="sanctuary-layout">
            <section className="panel">
              <h2>Monsters</h2>
              <div className="monster-grid">
                {state.monsters.map((m) => (
                  <MonsterCard
                    key={m.id}
                    monster={m}
                    selected={selectedId === m.id}
                    onClick={() => setSelectedId(m.id)}
                  />
                ))}
              </div>
            </section>
            <section className="panel">
              <h2>Eggs</h2>
              <EggPanel
                eggs={state.eggs}
                hasNest={hasNest}
                atCapacity={atCapacity}
                onAction={act}
              />
            </section>
            {selectedMonster && (
              <section className="panel panel--detail">
                <MonsterDetail
                  monster={selectedMonster}
                  caretakers={state.caretakers}
                  bloodlineName={
                    state.bloodlines.find((b) => b.id === selectedMonster.bloodlineId)?.name ?? 'Unknown'
                  }
                  onAction={act}
                  hasRehabCenter={hasRehabCenter}
                  rehabFull={rehabFull}
                />
              </section>
            )}
          </div>
        )}

        {tab === 'monsters' && (
          <div className="monsters-layout">
            <section className="panel">
              <div className="monster-grid">
                {state.monsters.map((m) => (
                  <MonsterCard
                    key={m.id}
                    monster={m}
                    selected={selectedId === m.id}
                    onClick={() => setSelectedId(m.id)}
                  />
                ))}
              </div>
            </section>
            {selectedMonster && (
              <section className="panel panel--detail">
                <MonsterDetail
                  monster={selectedMonster}
                  caretakers={state.caretakers}
                  bloodlineName={
                    state.bloodlines.find((b) => b.id === selectedMonster.bloodlineId)?.name ?? 'Unknown'
                  }
                  onAction={act}
                  hasRehabCenter={hasRehabCenter}
                  rehabFull={rehabFull}
                />
              </section>
            )}
          </div>
        )}

        {tab === 'breeding' && (
          <section className="panel">
            <BreedingPanel
              monsters={state.monsters}
              parentAId={state.breedingPair.parentAId}
              parentBId={state.breedingPair.parentBId}
              hasBreedingDen={hasBreedingDen}
              atCapacity={atCapacity}
              onAction={act}
            />
          </section>
        )}

        {tab === 'caretakers' && (
          <section className="panel">
            <CaretakersPanel caretakers={state.caretakers} monsters={state.monsters} />
          </section>
        )}

        {tab === 'buildings' && (
          <section className="panel">
            <BuildingsPanel
              buildings={state.buildings}
              gold={state.sanctuary.gold}
              onAction={act}
            />
          </section>
        )}

        {tab === 'heritage' && (
          <section className="panel">
            <HeritagePanel bloodlines={state.bloodlines} sanctuary={state.sanctuary} />
          </section>
        )}
      </main>

      <footer className="footer">
        <p>
          Time passes automatically. Feed monsters, hatch eggs, breed bloodlines, and build your legacy.
        </p>
      </footer>
    </div>
  )
}
