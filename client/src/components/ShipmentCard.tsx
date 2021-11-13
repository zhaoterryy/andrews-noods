import type { Shipment } from '../utils/schema-types'
import './ShipmentCard.css'
import '../styles/lds-ellipsis.css'
import assetMap from '../utils/asset-map.json'
import trashOutlineSvg from '../assets/trash-outline.svg'
import boatOutlineSvg from '../assets/boat-outline.svg'
import { useMutations } from '../hooks/mutations'
import { useState } from 'react'

interface assetMap {
  [key: string]: string
}

type ShipmentCardProps = {
  shipment: Shipment
  onShipmentDeleted: (shipmentId: string) => void
}

function getAssetURL(asset: string) {
  const assetMapUrl = new URL('../utils/asset-map.json', import.meta.url).href
  return new URL(asset, assetMapUrl).href
}

export function ShipmentCard({ shipment, onShipmentDeleted }: ShipmentCardProps) {
  const { thumbnail, alt, name } = assetMap[shipment.UPC]
  const { deleteShipment } = useMutations()
  const [isLoading, setIsLoading] = useState(false)

  const onDeleteClick = async () => {
    setIsLoading(true)

    try {
      await deleteShipment(shipment.shipmentId)
    } catch (e) {
      console.error(e)
    }

    onShipmentDeleted(shipment.shipmentId)
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
          {shipment.hasShipped &&
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
        <button className="set-shipped-btn">
          <img src={boatOutlineSvg} alt=""></img>
        </button>
        <button className="delete-btn" onClick={onDeleteClick}>
          <img src={trashOutlineSvg} alt=""></img>
        </button>
      </div>
    </div>
  )
}
