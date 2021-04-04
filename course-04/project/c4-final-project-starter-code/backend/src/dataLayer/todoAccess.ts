import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate'

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todosTableUserIdIndex = process.env.TODOS_USERID_INDEX
  ) {}

  async getTodosByUser(userId: string): Promise<TodoItem[]> {
    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: this.todosTableUserIdIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    return result.Items as TodoItem[]
  }

  async getTodoById(todoId: string): Promise<TodoItem> {
    const result = await this.docClient
      .get({
        TableName: this.todosTable,
        Key: {
          todoId: todoId
        }
      })
      .promise()

    const item = result.Item
    return item as TodoItem
  }

  async createTodo(item: TodoItem): Promise<TodoItem> {
    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: item
      })
      .promise()

    return item
  }

  async deleteTodo(todoId: string): Promise<TodoItem> {
    const item = await this.getTodoById(todoId)

    await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: {
          todoId: item.todoId
        }
      })
      .promise()

    return item
  }

  async updateTodo(todoId: string, updatedTodo: TodoUpdate): Promise<void> {
    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          todoId: todoId
        }
        //todo : update logic
      })
      .promise()

    return
  }

  async updateTodoItemImage(todoId: string, imageUrl: string): Promise<void> {
    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          todoId: todoId
        }
        //todo : update logic
      })
      .promise()

    return
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
