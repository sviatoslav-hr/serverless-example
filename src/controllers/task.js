const AWS = require('aws-sdk');
const { StatusCodes } = require('http-status-codes');
const { v1: uuidv1 } = require('uuid');
const HttpResponse = require('../models/response');
const { validateTask } = require('../validators/validate-task');


const createTask = async (event, context) => {
  let body = {};

  try {
    body = JSON.parse(event.body);
  } catch (parseError) {
    console.log('An error happened during parsing the body', parseError);
    return HttpResponse.internal_server_error();
  }

  try {
    validateTask(body);
  } catch (error) {
    console.log('Task validation has failed', error.toString());
    return HttpResponse.bad_request({ errorCode: error.errorCode });
  }

  const params = {
    ...getParams(),
    Item: {
      id: uuidv1(),
      title: body.title,
      description: body.description,
    }
  };

  let result = {};

  try {
    let dynamodb = new AWS.DynamoDB.DocumentClient();
    result = await dynamodb.put(params).promise();
  } catch (putError) {
    console.log('Error happened during putting the task\n Params:', params);
    console.log('PutError', putError);
    return HttpResponse.internal_server_error();
  }

  return new HttpResponse(StatusCodes.CREATED, result);
}


const getAllTasks = async (event, context) => {
  const params = getParams();
  let result = {};

  try {
    let dynamodb = new AWS.DynamoDB.DocumentClient();
    result = await dynamodb.scan(params).promise();
  } catch (scanError) {
    console.log('Error happened during scanning the tasks\n Params:', params);
    console.log('ScanError', scanError);
    return HttpResponse.internal_server_error();
  }

  if (!result.Items || !Array.isArray(result.Items) || !result.Items.length) {
    return HttpResponse.not_found();
  }

  return HttpResponse.ok(result.Items);
}


const getTaskById = async (event, context) => {
  const params = {
    ...getParams(),
    Key: {
      id: event.pathParameters.id,
    },
  };

  let result = {};

  try {
    let dynamodb = new AWS.DynamoDB.DocumentClient();
    result = await dynamodb.get(params).promise();
  } catch (getError) {
    console.log('Error happened during getting the task\n Params:', params);
    console.log('GetError', getError);
    return HttpResponse.internal_server_error();
  }

  if (!result.Item) {
    return HttpResponse.not_found();
  }

  return HttpResponse.ok(result.Item);
}

const updateTaskById = async (event, context) => {
  let body = {};

  try {
    body = JSON.parse(event.body);
  } catch (parseError) {
    console.log('An error happened during parsing the body', parseError);
    return HttpResponse.internal_server_error();
  }

  try {
    validateTask(body);
  } catch (error) {
    console.log('Task validation has failed', error.toString());
    return HttpResponse.bad_request({ errorCode: error.errorCode });
  }

  const params = {
    ...getParams(),
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      '#title': 'title',
    },
    ExpressionAttributeValues: {
      ':title': body.title,
      ':description': body.description,
    },
    UpdateExpression: 'SET #title = :title, description = :description',
    ReturnValues: 'ALL_NEW',
  };

  let result = {};

  try {
    let dynamodb = new AWS.DynamoDB.DocumentClient();
    result = await dynamodb.update(params).promise();
  } catch (updateError) {
    console.log('Error happened during updating the task\n Params:', params);
    console.log('UpdateError', updateError);
    return HttpResponse.internal_server_error();
  }

  return HttpResponse.ok();
}

const deleteTaskById = async (event, context) => {
  const params = {
    ...getParams(),
    Key: {
      id: event.pathParameters.id,
    },
  };

  let result = {};

  try {
    let dynamodb = new AWS.DynamoDB.DocumentClient();
    result = await dynamodb.delete(params).promise();
  } catch (deleteError) {
    console.log('Error happened during deleting the task\n Params:', params);
    console.log('DeleteError', deleteError);
    return HttpResponse.internal_server_error();
  }

  return HttpResponse.ok();
}


const getParams = () => ({
  TableName: process.env.DYNAMODB_TASKS_TABLE,
});


module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
}