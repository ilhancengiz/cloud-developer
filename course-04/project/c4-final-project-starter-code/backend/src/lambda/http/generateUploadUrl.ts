import 'source-map-support/register'

import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  APIGatewayProxyHandler
} from 'aws-lambda'
import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'
import * as AWSXRay from 'aws-xray-sdk'
import { updateTodoItemImage } from '../../businessLogic/todoLogic'

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const todoId = event.pathParameters.todoId
  const imageId = uuid.v4()
  const url = getUploadUrl(imageId)
  const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageId}`
  const todoItem = await updateTodoItemImage(todoId, imageUrl)

  return {
    statusCode: 200,
    body: JSON.stringify({
      item: todoItem,
      uploadUrl: url
    })
  }
}

function getUploadUrl(imageId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: imageId,
    Expires: urlExpiration
  })
}
