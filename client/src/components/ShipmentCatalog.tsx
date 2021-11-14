import { createHttpLink, useApolloClient } from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { ChangeEvent, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/auth'
import { useGetAllShipments, useGetShipmentsOfUPC } from '../hooks/queries'
import { Shipment, ValidUPC, validUPCs } from '../utils/schema-types'
import { CreateShipmentCard } from './CreateShipmentCard'
import { ShipmentCard } from './ShipmentCard'
import fetchIcon from '../assets/cloud-download-outline.svg'
import './ShipmentCatalog.css'

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

  const [allShipments, getAllShipments] = useGetAllShipments()
  const [UPCFilteredShipments, getShipmentsOfUPC] = useGetShipmentsOfUPC()
  const [shipments, setShipments] = useState(new Array<Shipment>())
  const [shipmentsToShow, setShipmentsToShow] = useState(new Array<Shipment>())
  const [currentUPCFilter, setCurrentUPCFilter] = useState<ValidUPC | ''>('')

  useEffect(() => {
    getAllShipments()
  }, [])

  useEffect(() => {
    setShipments(allShipments)
  }, [allShipments])

  useEffect(() => {
    setShipments(UPCFilteredShipments)
  }, [UPCFilteredShipments])

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

  const onFetch = () => {
    if (currentUPCFilter === '') {
      getAllShipments()
    } else {
      getShipmentsOfUPC(currentUPCFilter)
    }
  }

  const onShipmentDeleted = (shipmentId: string) => {
    setShipments(shipments.filter(s => s.shipmentId !== shipmentId))
  }

  const onShipmentCreated = (shipment: Shipment) => {
    setShipments([...shipments, shipment])
  }

  return (
    <div className="shipment-catalog">
      <div className="filter-container">
        <label htmlFor="UPC-filter-change">UPC Filter: </label>
        <select id="UPC-filter-change" onChange={onUPCFilterChange} value={currentUPCFilter}>
          <option value="">None</option>
          {
            validUPCs.map(upc => <option key={upc} value={upc}>{upc}</option>)
          }
        </select>
        <button className="fetch-btn" onClick={onFetch}>
          <img src={fetchIcon} />
        </button>
      </div>
      <div className="shipment-card-container">
        {shipmentsToShow.map(s => (
          <ShipmentCard
            key={s.shipmentId}
            shipment={s}
            onShipmentDeleted={onShipmentDeleted} />
        ))}
        {currentUPCFilter === '' && <CreateShipmentCard onShipmentCreated={onShipmentCreated} />}
      </div>
    </div>
  )
}
