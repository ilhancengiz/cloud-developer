import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { getTodoItem, updateTodoItemImage } from '../../businessLogic/todoLogic'
import { createLogger } from '../../utils/logger'
import { getUserId } from '../utils'
import * as middy from 'middy'

const logger = createLogger('uploadUrl')
const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.TODO_IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const todoItem = await getTodoItem(todoId)
    const isItemExists = !!todoItem
    const userId = getUserId(event)

    if (!isItemExists) {
      logger.error(
        `${userId} attempted to create upload url for non-existing todo item with id of : ${todoId}`
      )
      return {
        statusCode: 404,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          error: `${todoId} item not exists.`
        })
      }
    }

    const todoOwner = todoItem.userId

    if (todoOwner !== userId) {
      logger.error(
        `${userId} attempted to create upload url for ${todoId} with owner of ${todoOwner}`
      )
      return {
        statusCode: 403,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: 'only owner can create upload url for this item.'
      }
    }

    const url = getUploadUrl(todoId)
    const imageUrl = `https://${bucketName}.s3.amazonaws.com/${todoId}`
    await updateTodoItemImage(todoId, imageUrl)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        uploadUrl: url
      })
    }
  }
)

function getUploadUrl(imageId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: urlExpiration
  })
}
