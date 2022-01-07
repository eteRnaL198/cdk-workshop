#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkWorkshopStack } from '../lib/cdk-workshop-stack';
import { HelloCdkStack } from '../lib/hello-cdk-stack';

const app = new cdk.App();
new CdkWorkshopStack(app, 'CdkWorkshopStack');
new HelloCdkStack(app, 'HelloCdkStack');
