import { createHttpLink, useApolloClient } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Navigate } from 'react-router-dom'
import fetchIcon from '../assets/cloud-download-outline.svg'
import { useAuth } from '../hooks/auth'
import { useGetAllShipments, useGetDecayingShipments } from '../hooks/queries'
import '../styles/lds-ripple.css'
import { Shipment, ValidUPC, validUPCs } from '../utils/schema-types'
import { CreateShipmentCard } from './CreateShipmentCard'
import { ShipmentCard } from './ShipmentCard'
import './ShipmentCatalog.css'
import addShipmentIcon from '../assets/add-circle.svg'

export function ShipmentCatalog() {
  const { isAuthenticated, token } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    }
  })

  const httpLink = createHttpLink({
    uri: import.meta.env.VITE_GRAPHQL_URI
  })

  const client = useApolloClient()
  client.setLink(authLink.concat(httpLink))

  const [shipments, setShipments] = useState(new Array<Shipment>())
  const [shipmentsToShow, setShipmentsToShow] = useState(new Array<Shipment>())

  const [allShipments, getAllShipments] = useGetAllShipments()
  const [decayingShipments, getDecayingShipments] = useGetDecayingShipments()

  const [currentUPCFilter, setCurrentUPCFilter] = useState<ValidUPC | ''>('')
  const [isDecayFilterActive, setDecayFilterActive] = useState(false)

  const [isFetching, setIsFetching] = useState(false)
  const createShipmentElement = useRef<HTMLDivElement>(null)

  const fetch = async () => {
    setIsFetching(true)

    let newShipments
    if (isDecayFilterActive) {
      newShipments = await getDecayingShipments(currentUPCFilter === '' ? undefined : currentUPCFilter)
    } else {
      newShipments = await getAllShipments()
    }

    setIsFetching(false)
    setShipments(newShipments)
  }

  useEffect(() => {
    fetch()
  }, [])

  useEffect(() => {
    fetch()
  }, [isDecayFilterActive])

  useEffect(() => {
    if (isDecayFilterActive) fetch()
  }, [currentUPCFilter])

  useEffect(() => {
    if (currentUPCFilter === '') {
      setShipmentsToShow(shipments)
    } else {
      setShipmentsToShow(shipments.filter(s => s.UPC === currentUPCFilter))
    }
  }, [shipments, currentUPCFilter])

  const onUPCFilterChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const UPC = e.target.value as ValidUPC | ''
    setCurrentUPCFilter(UPC)
  }

  const onDecayFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    setDecayFilterActive(e.target.checked)
  }

  const onShipmentDeleted = (shipmentId: string) => {
    setShipments(shipments.filter(s => s.shipmentId !== shipmentId))
  }

  const onShipmentCreated = (shipment: Shipment) => {
    setShipments([...shipments, shipment])
  }

  const onAddShipmentClick = () => {
    createShipmentElement.current!.scrollIntoView({
      behavior: 'smooth'
    })
  }

  return (
    <div className="shipment-catalog">
      <div className="filter-container">
        <div className="UPC-filter-wrapper">
          <label htmlFor="UPC-filter-change">UPC Filter: </label>
          <select id="UPC-filter-change" onChange={onUPCFilterChange} value={currentUPCFilter}>
            <option value="">None</option>
            {
              validUPCs.map(upc => <option key={upc} value={upc}>{upc}</option>)
            }
          </select>
        </div>
        <div className="decay-checkbox-wrapper">
          <input type="checkbox" name="decay-checkbox" id="decay-checkbox" onChange={onDecayFilterChange} checked={isDecayFilterActive} />
          <label htmlFor="decay-checkbox">Urgent only (orders that have been waiting the longest)</label>
        </div>
        <div className="fetch-btn-wrapper">
          {isFetching ? (
            <div className="lds-ripple spinner"><div></div><div></div></div>
          ) : (
            <button className="fetch-btn" onClick={fetch}>
              <img src={fetchIcon} />
            </button>
          )}
        </div>
      </div>
      <div className="shipment-card-container">
        {shipmentsToShow.map(s => (
          <ShipmentCard
            key={s.shipmentId}
            shipment={s}
            showTimeSinceOrder={isDecayFilterActive}
            onShipmentDeleted={onShipmentDeleted} />
        ))}
        {currentUPCFilter === '' && !isDecayFilterActive && <CreateShipmentCard onShipmentCreated={onShipmentCreated} ref={createShipmentElement}/>}
      </div>
      {currentUPCFilter === '' && !isDecayFilterActive && (
        <button className="add-shipment-btn" onClick={onAddShipmentClick}>
          <img src={addShipmentIcon} alt="floating add shipment button" />
        </button>
      )}
    </div>
  )
}
