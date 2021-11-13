import { useGetShipments } from './hooks/queries'
import { ShipmentCard } from './components/ShipmentCard'
import './App.css'

function App() {
  const { shipments } = useGetShipments()

  return (
    <div className="App">
      <header className="App-header">
        <div className="shipment-card-container">
          {shipments.map(s => (
            <ShipmentCard
              key={s.shipmentId}
              shipment={s} />
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
