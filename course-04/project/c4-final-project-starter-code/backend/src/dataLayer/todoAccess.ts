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
    const queryParams = {
      TableName: this.todosTable,
      IndexName: this.todosTableUserIdIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }

    const result = await this.docClient.query(queryParams).promise()
    return result.Items as TodoItem[]
  }

  async createTodo(item: TodoItem): Promise<TodoItem> {
    const createParams = {
      TableName: this.todosTable,
      Item: item
    }

    await this.docClient.put(createParams).promise()
    return item
  }

  async deleteTodo(todoId: string): Promise<void> {
    const deleteParams = {
      TableName: this.todosTable,
      Key: {
        todoId
      }
    }

    await this.docClient.delete(deleteParams).promise()
  }

  async updateTodo(todoId: string, updatedTodo: TodoUpdate): Promise<void> {
    const updateParams = {
      TableName: this.todosTable,
      Key: {
        todoId
      },
      UpdateExpression: 'set name = :name, done = :done, dueDate = :dueDate',
      ExpressionAttributeValues: {
        ':name': updatedTodo.name,
        ':done': updatedTodo.done,
        ':dueDate': updatedTodo.dueDate
      }
    }
    await this.docClient.update(updateParams).promise()

    return
  }

  async updateTodoItemImage(todoId: string, imageUrl: string): Promise<void> {
    const updateImageParams = {
      TableName: this.todosTable,
      Key: {
        todoId
      },
      UpdateExpression: 'set attachmentUrl = :imageUrl',
      ExpressionAttributeValues: {
        ':imageUrl': imageUrl
      }
    }
    await this.docClient.update(updateImageParams).promise()
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
