import { useGetShipments } from './hooks/queries'
import { ShipmentCard } from './components/ShipmentCard'
import './App.css'
import { useEffect, useState } from 'react'
import type { Shipment } from './utils/schema-types'
import { CreateShipmentCard } from './components/CreateShipmentCard'

function App() {
  const { shipments } = useGetShipments()
  const [shipmentsToShow, setShipmentsToShow] = useState(new Array<Shipment>())

  useEffect(() => {
    console.log('hit')
    setShipmentsToShow(shipments)
  }, [shipments])

  const onShipmentDeleted = (shipmentId: string) => {
    setShipmentsToShow(shipmentsToShow.filter(s => s.shipmentId !== shipmentId))
  }

  const onShipmentCreated = (shipment: Shipment) => {
    console.log(shipment)
    setShipmentsToShow([...shipmentsToShow, shipment])
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
          <CreateShipmentCard onShipmentCreated={onShipmentCreated} />
        </div>
      </header>
    </div>
  )
}

export default App
