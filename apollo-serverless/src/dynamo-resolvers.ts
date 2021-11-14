import { unmarshall } from '@aws-sdk/util-dynamodb'
import { DynamoDBClient, ScanCommand, ScanCommandInput, GetItemCommand, GetItemCommandInput, PutItemCommand, PutItemCommandInput, UpdateItemCommand, UpdateItemCommandInput, DeleteItemCommandInput, DeleteItemCommand } from '@aws-sdk/client-dynamodb'
import { nanoid } from 'nanoid'

const TABLE_NAME = 'instant-noodle-shipments'
const dynamoClient = new DynamoDBClient({ region: 'us-east-2' })

export const getShipments = async () => {
  const params: ScanCommandInput = {
    TableName: TABLE_NAME
  }

  try {
    const results = await dynamoClient.send(new ScanCommand(params))
    return results.Items?.map(item => unmarshall(item))
  } catch (err) {
    console.error(err)
    return err
  }
}

export const getShipmentsOfUPC = async (UPC: string) => {
  const params: ScanCommandInput = {
    TableName: TABLE_NAME,
    FilterExpression: 'UPC = :UPC',
    ExpressionAttributeValues: {
      ':UPC': { S: UPC }
    }
  }

  try {
    const results = await dynamoClient.send(new ScanCommand(params))
    return results.Items?.map(item => unmarshall(item))
  } catch (err) {
    console.error(err)
    return err
  }
}

export const getShipment = async (shipmentId: string) => {
  const params: GetItemCommandInput = {
    TableName: TABLE_NAME,
    Key: {
      shipmentId: { S: shipmentId }
    }
  }

  try {
    const results = await dynamoClient.send(new GetItemCommand(params))
    return unmarshall(results.Item)
  } catch (err) {
    console.error(err)
    return err
  }
}

export const createShipment = async (UPC: string, quantity: number, specialOrder?: boolean) => {
  const orderTime = new Date(Date.now()).toISOString()
  const shipmentId = nanoid()
  const params: PutItemCommandInput = {
    TableName: TABLE_NAME,
    Item: {
      shipmentId: { S: shipmentId },
      UPC: { S: UPC },
      numOrdered: { N: quantity.toString() },
      orderTime: { S: orderTime },
      hasNotShipped: { S: 'true' }
    }
  }

  if (specialOrder) {
    params.Item.isSpecialOrder = { BOOL: true }
  }

  try {
    await dynamoClient.send(new PutItemCommand(params))
    return {
      shipmentId,
      orderTime
    }
  } catch (err) {
    console.error(err)
    return err
  }
}

export const setHasShipped = async (shipmentId: string, hasShipped: boolean) => {
  const params: UpdateItemCommandInput = {
    TableName: TABLE_NAME,
    Key: {
      shipmentId: { S: shipmentId }
    },
    ReturnValues: 'ALL_NEW'
  }

  if (!hasShipped) {
    params.UpdateExpression = 'set hasNotShipped = :hasNotShipped'
    params.ExpressionAttributeValues = {
      ':hasNotShipped': { S: 'true' }
    }
  } else {
    params.UpdateExpression = 'remove hasNotShipped'
  }

  try {
    const results = await dynamoClient.send(new UpdateItemCommand(params))
    return unmarshall(results.Attributes)
  } catch (err) {
    console.error(err)
    return err
  }
}

export const deleteShipment = async (shipmentId: string) => {
  const params: DeleteItemCommandInput = {
    TableName: TABLE_NAME,
    Key: {
      shipmentId: { S: shipmentId }
    },
    ReturnValues: 'ALL_OLD'
  }

  try {
    const results = await dynamoClient.send(new DeleteItemCommand(params))
    return unmarshall(results.Attributes)
  } catch (err) {
    console.error(err)
    return err
  }
}
