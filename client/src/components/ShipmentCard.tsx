import type { Shipment } from '../utils/schema-types'
import './ShipmentCard.css'
import assetMap from '../utils/asset-map.json'
import trashOutlineSvg from '../assets/trash-outline.svg'
import boatOutlineSvg from '../assets/boat-outline.svg'

interface assetMap {
  [key: string]: string
}

type ShipmentCardProps = {
  shipment: Shipment
}

function getAssetURL(asset: string) {
  const assetMapUrl = new URL('../utils/asset-map.json', import.meta.url).href
  return new URL(asset, assetMapUrl).href
}

export function ShipmentCard({ shipment }: ShipmentCardProps) {
  const { thumbnail, alt, name } = assetMap[shipment.UPC]

  return (
    <div className="shipment-card">
      <img
        className="thumbnail"
        src={getAssetURL(thumbnail)}
        alt={alt} />
      <div className="info">
        <h1 className="title">{name}</h1>
        <p className="details">
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
        <button className="delete-btn">
          <img src={trashOutlineSvg} alt=""></img>
        </button>
      </div>
    </div>
  )
}
