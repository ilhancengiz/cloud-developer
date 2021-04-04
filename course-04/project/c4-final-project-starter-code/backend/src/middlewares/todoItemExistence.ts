/* todo: convert to middleware

const todoItem = await getTodoItem(todoId)
    const isItemExists = !!todoItem
    const userId = getUserId(event)

    if (!isItemExists) {
      logger.error(
        `${userId} attempted to delete non-existing todo item with id of : ${todoId}`
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
*/
