import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todoAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const todoAccess = new TodoAccess()

export async function getTodosByUser(userId: string): Promise<TodoItem[]> {
  return todoAccess.getTodosByUser(userId)
}

export async function getTodoItem(todoId: string): Promise<TodoItem> {
  return todoAccess.getTodoBydId(todoId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const itemId = uuid.v4()

  return todoAccess.createTodo({
    todoId: itemId,
    userId: userId,
    done: false,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    createdAt: new Date().toISOString()
  })
}

export async function updateTodo(
  todoId: string,
  updateTodoRequest: UpdateTodoRequest
): Promise<void> {
  return todoAccess.updateTodo(todoId, {
    name: updateTodoRequest.name,
    done: updateTodoRequest.done,
    dueDate: updateTodoRequest.dueDate
  })
}

export async function updateTodoItemImage(
  todoId: string,
  imageUrl: string
): Promise<void> {
  return todoAccess.updateTodoItemImage(todoId, imageUrl)
}

export async function deleteTodo(todoId: string): Promise<void> {
  return todoAccess.deleteTodo(todoId)
}
