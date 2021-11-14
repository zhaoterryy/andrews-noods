import { ChangeEvent, MouseEventHandler, useRef, useState } from 'react'
import addIcon from '../assets/bag-add-outline.svg'
import placeholderIcon from '../assets/pizza.svg'
import { useMutations } from '../hooks/mutations'
import assetMap from '../utils/asset-map.json'
import { getAssetURL } from '../utils/get-asset-url'
import { Shipment, ValidUPC, validUPCs } from '../utils/schema-types'
import './CreateShipmentCard.css'
import './ShipmentCard.css'

type CreateShipmentCardProps = {
  onShipmentCreated: (shipment: Shipment) => void
}

export function CreateShipmentCard({ onShipmentCreated }: CreateShipmentCardProps) {
  const { createShipment } = useMutations()
  const [UPC, setUPC] = useState<ValidUPC | ''>('')
  const quantityField = useRef<HTMLInputElement>(null)
  const specialOrderField = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)

  const resetCard = () => {
    setUPC('')
    if (quantityField.current) {
      quantityField.current.value = '100'
    }

    if (specialOrderField.current) {
      specialOrderField.current.checked = false
    }
  }

  const onUPCChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setUPC(e.target.value as ValidUPC)
  }

  const onSubmit = async () => {
    if (UPC && quantityField.current && specialOrderField.current) {
      const quantity = parseInt(quantityField.current.value)
      const isSpecialOrder = specialOrderField.current.checked

      if (quantity >= 100) {
        setIsLoading(true)
        try {
          const { shipmentId, orderTime } = await createShipment(
            UPC,
            quantity,
            isSpecialOrder
          )

          const shipment: Shipment = {
            shipmentId,
            orderTime,
            UPC,
            numOrdered: quantity,
            isSpecialOrder,
            hasNotShipped: true
          }

          onShipmentCreated(shipment)
          resetCard()
        } catch (error) {
          console.error(error)
        }

        setIsLoading(false)
      }
    }
  }

  return (
    <div className="create-shipment-card shipment-card">
      {isLoading && (<div className="loading-overlay"><div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div></div>)}
      {UPC ? (
        <img className="thumbnail" src={getAssetURL(assetMap[UPC].thumbnail)} alt={getAssetURL(assetMap[UPC].alt)} />
      ) : (
        <img className="thumbnail" style={{ transform: 'scale(0.5)', opacity: 0.5 }} src={placeholderIcon} alt="pizza placeholder" />
      )}
      <div className="info">
        {UPC ? <h1 className="title">{assetMap[UPC].name}</h1> : <h1 className="title">Order a new shipment</h1>}
        <form onSubmit={(e) => e.preventDefault()}>
          <div className="label-container">
            <label htmlFor="upc-field">UPC: </label>
            <label htmlFor="quantity-field">Quantity: </label>
            <label htmlFor="special-order-field">Special order: </label>
          </div>
          <div className="input-container">
            <select required onChange={onUPCChange} value={UPC}>
              <option hidden disabled value="">Select a UPC</option>
              {
                validUPCs.map(upc => <option key={upc} value={upc}>{upc}</option>)
              }
            </select>
            <input type="number" name="quantity-field" id="quantity-field" min="100" placeholder="100" defaultValue="100" required ref={quantityField} />
            <input type="checkbox" name="special-order-field" id="special-order-field" ref={specialOrderField} />
          </div>
          <button className="submit-btn" type="submit" onClick={onSubmit}>
            <img src={addIcon} alt="bag add icon black outline" />
          </button>
        </form>
      </div>
    </div>
  )
}
