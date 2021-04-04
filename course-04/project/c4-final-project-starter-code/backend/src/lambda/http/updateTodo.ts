import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getTodoItem, updateTodo } from '../../businessLogic/todoLogic'
import { getUserId } from '../utils'
import { createLogger } from '../../utils/logger'
import * as middy from 'middy'

const logger = createLogger('updateTodo')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const todoItem = await getTodoItem(todoId)
    const isItemExists = !!todoItem
    const userId = getUserId(event)

    if (!isItemExists) {
      logger.error(
        `${userId} attempted to update non-existing todo item with id of : ${todoId}`
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
        `${userId} attempted to delete ${todoId} with owner of ${todoOwner}`
      )
      return {
        statusCode: 403,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: 'only owner can delete this item.'
      }
    }

    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)

    await updateTodo(todoId, updatedTodo)

    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: ''
    }
  }
)
