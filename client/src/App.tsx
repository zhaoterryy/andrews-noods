import { useGetShipments } from './hooks/queries'
import { ShipmentCard } from './components/ShipmentCard'
import './App.css'
import { useEffect, useState } from 'react'
import type { Shipment } from './utils/schema-types'

function App() {
  const { shipments } = useGetShipments()
  const [shipmentsToShow, setShipmentsToShow] = useState(new Array<Shipment>())

  useEffect(() => setShipmentsToShow(shipments), [shipments])

  const onShipmentDeleted = (shipmentId: string) => {
    setShipmentsToShow(shipmentsToShow.filter(s => s.shipmentId !== shipmentId))
  }

  return (
    <div className="App">
      <header className="App-header">
        <div className="shipment-card-container">
          {shipmentsToShow.map(s => (
            <ShipmentCard
              key={s.shipmentId}
              shipment={s}
              onShipmentDeleted={onShipmentDeleted} />
          ))}
          <div className="create-shipment-card shipment-card">
            TODO
          </div>
        </div>
      </header>
    </div>
  )
}

export default App
