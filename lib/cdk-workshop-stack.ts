import * as cdk from 'aws-cdk-lib';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigw from 'aws-cdk-lib/aws-apigateway'
import { Construct } from 'constructs';
import { HitCounter } from './hitcounter';
import { ViewPage } from './viewPage';
import { TableViewer } from 'cdk-dynamo-table-viewer';

export class CdkWorkshopStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // defines an AWS Lamdba resource
    const hello = new lambda.Function(this, 'HelloHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,  // execution envinronment
      code: lambda.Code.fromAsset('lambda'),  // code loaded from "lambda" directory
      handler: 'hello.handler'  // file is "hello", function is "handler"
    })

    const helloWithCounter = new HitCounter(this, 'HelloHitCounter', {
      downstream: hello
    })

    const viewPage = new ViewPage(this, 'ViewPage')

    // defines an API Gateway REST API resource backed by our "hello" function.
    new apigw.LambdaRestApi(this, 'Endpoint', {
      // handler: helloWithCounter.handler
      handler: viewPage.handler
    })

    new TableViewer(this, 'ViewHitCounter', {
      title: 'Hello Hits',
      table: helloWithCounter.table,
      sortBy: '-hits',
    })

  }
}


// Outputs:
// CdkWorkshopStack.Endpoint8024A810 = https://7c9b1aktmj.execute-api.ap-northeast-1.amazonaws.com/prod/
// CdkWorkshopStack.ViewHitCounterViewerEndpointCA1B1E4B = https://bvhhtt0ukd.execute-api.ap-northeast-1.amazonaws.com/prod/