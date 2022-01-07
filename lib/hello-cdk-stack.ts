import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { Table, AttributeType } from 'aws-cdk-lib/aws-dynamodb';
import { RestApi, LambdaIntegration, IResource, MockIntegration, PassthroughBehavior } from 'aws-cdk-lib/aws-apigateway';

export class HelloCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const dynamoTable = new Table(this, "items", {
      partitionKey: {
        name: "itemId",
        type: AttributeType.STRING,
      },
      tableName: "HelloCdkStack-items07D08F4B-LHXL892ZG47G",
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const getItemLambda = new lambda.Function(this, 'getOneItemFunction', {
      code: new lambda.AssetCode("lambda"),
      handler: "get-item.handler",
      runtime: lambda.Runtime.NODEJS_14_X,
      environment: {
        TABLE_NAME: dynamoTable.tableName,
        PRIMARY_KEY: "itemId",
      }
    });

    // DynamoDB読み取り権限をLambdaに付与
    dynamoTable.grantReadData(getItemLambda);

    // Api Gateway
    const api = new RestApi(this, "itemsApi", {
      restApiName: "Items Service",
    });
    const items = api.root.addResource("items");
    
    const singleItem = items.addResource("{id}");
    const getItemIntegration = new LambdaIntegration(getItemLambda);
    singleItem.addMethod('GET', getItemIntegration);
    // addCorsOptions(items);

  }
}

export function addCorsOptions(apiResource: IResource) {
  apiResource.addMethod(
    "OPTIONS",
    new MockIntegration({
      integrationResponses: [
        {
          statusCode: "200",
          responseParameters: {
              "method.resopnse.header.Access-Control-Allow-Headers":
              "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
              "method.response.header.Access-Control-Allow-Origin": "'*'",
              "method.response.header.Access-Control-Allow-Credentials":
              "'false'",
              "method.response.header.Access-Control-Allow-Methods":
              "'OPTIONS,GET,PUT,POST,DELETE'",
          },
        },
      ],
      passthroughBehavior: PassthroughBehavior.NEVER,
      requestTemplates: {
        "application/json": '{"statusCode": 200}',
      },
    }),
      {
        methodResponses: [
          {
            statusCode: "200",
            responseParameters: {
              "method.response.header.Access-Control-Allow-Headers": true,
              "method.response.header.Access-Control-Allow-Methods": true,
              "method.response.header.Access-Control-Allow-Credentials": true,
              "method.response.header.Access-Control-Allow-Origin": true,
            },
          },
        ]
      }
  );
}

// Outputs:
// HelloCdkStack.itemsApiEndpoint8392E274 = https://n0suncjkxi.execute-api.ap-northeast-1.amazonaws.com/prod/
