import * as AWS from 'aws-sdk';
import { TodoItem } from '../models/TodoItem';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { CreateTodoRequest } from '../requests/CreateTodoRequest';

export interface todoCreateData {
  userId: string
  createdAt: string
  name: string
  dueDate: string
  done: boolean
  attachmentUrl?: string
}

class TodosRepository {
  private client: DocumentClient;
  private table: string;
  private todoIdIndex: string;

  constructor(client) {
    this.client = client;
    this.table = process.env.TODOS_TABLE;
    this.todoIdIndex = process.env.TODO_ID_INDEX;
  }

  async create(todo: CreateTodoRequest): Promise<TodoItem> {
    
  }

  async getById(todoId: string): Promise<TodoItem> {
    const result = await this.client
      .query({
        TableName: this.table,
        IndexName: this.todoIdIndex,
        KeyConditionExpression: 'todoId = :todoId',
        ExpressionAttributeValues: {
          ':todoId': todoId
        }
      })
      .promise();

    return <TodoItem>result.Items[0];
  }

  async getPerUser(userId: string): Promise<TodoItem[]> {
    const result = await this.client
      .query({
        TableName: this.table,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        },
        ScanIndexForward: false
      })
      .promise();

    return <Promise<TodoItem[]>>result.Items;
  }
}

export default new TodosRepository(new AWS.DynamoDB.DocumentClient());
