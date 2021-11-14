import type { Shipment } from '../utils/schema-types'
import './ShipmentCard.css'
import '../styles/lds-ellipsis.css'
import assetMap from '../utils/asset-map.json'
import trashOutlineSvg from '../assets/trash-outline.svg'
import boatOutlineSvg from '../assets/boat-outline.svg'
import { useMutations } from '../hooks/mutations'
import { useState } from 'react'
import { getAssetURL } from '../utils/get-asset-url'

interface assetMap {
  [key: string]: string
}

type ShipmentCardProps = {
  shipment: Shipment
  onShipmentDeleted: (shipmentId: string) => void
}

export function ShipmentCard({ shipment, onShipmentDeleted }: ShipmentCardProps) {
  const { thumbnail, alt, name } = assetMap[shipment.UPC]
  const { deleteShipment, setHasShipped } = useMutations()
  const [isLoading, setIsLoading] = useState(false)
  const [showHasShipped, setShowHasShipped] = useState(!shipment.hasNotShipped)

  const onDeleteClick = async () => {
    setIsLoading(true)

    try {
      await deleteShipment(shipment.shipmentId)
      onShipmentDeleted(shipment.shipmentId)

      return
    } catch (e) {
      console.error('Failed to delete %s', shipment.shipmentId)
      console.error(e)
    }

    setIsLoading(false)
  }

  const onSetShippedClick = async () => {
    setIsLoading(true)

    try {
      const { hasShipped } = await setHasShipped(shipment.shipmentId, !showHasShipped)
      setShowHasShipped(hasShipped)
    } catch (e) {
      console.error('Failed to set shipped status %s', shipment.shipmentId)
      console.error(e)
    }

    setIsLoading(false)
  }

  return (
    <div className="shipment-card">
      {isLoading && (<div className="loading-overlay"><div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>)}
      <img
        className="thumbnail"
        src={getAssetURL(thumbnail)}
        alt={alt} />
      <div className="info">
        <h1 className="title">{name}</h1>
        <p className="details">
          {shipment.isSpecialOrder &&
            <>
              <em>Limited edition run!</em><br />
            </>
          }
          {showHasShipped &&
            <>
              <em>On it's way!</em><br />
            </>
          }
          UPC: {shipment.UPC}<br />
          Ordered at: {new Date(shipment.orderTime).toLocaleString()}<br />
          Quantity: {shipment.numOrdered}<br />
          Shipment ID: {shipment.shipmentId}
        </p>
      </div>
      <div className="buttons">
        <button className="set-shipped-btn" onClick={onSetShippedClick}>
          <img src={boatOutlineSvg} alt="ship button white outline"></img>
        </button>
        <button className="delete-btn" onClick={onDeleteClick}>
          <img src={trashOutlineSvg} alt="trash can button white outline"></img>
        </button>
      </div>
    </div>
  )
}
