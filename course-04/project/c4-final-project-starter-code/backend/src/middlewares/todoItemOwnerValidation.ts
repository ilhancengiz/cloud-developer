/* todo: convert to middleware

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
*/
