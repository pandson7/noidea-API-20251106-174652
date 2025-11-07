#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { NoideaApiStack } from '../lib/noidea-api-stack';

const app = new cdk.App();
new NoideaApiStack(app, 'NoideaApiStack20251106174652', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});