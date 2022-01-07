import * as lambda from 'aws-cdk-lib/aws-lambda';
import { Construct } from 'constructs';

export class ViewPage extends Construct {

  public readonly handler: lambda.Function;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.handler = new lambda.Function(this, 'ViewPageHandler', {
      runtime: lambda.Runtime.NODEJS_14_X,
      handler: 'page.handler',
      code: lambda.Code.fromAsset('lambda'),
    })
  }
}