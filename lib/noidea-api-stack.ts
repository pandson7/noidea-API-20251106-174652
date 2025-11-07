import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class NoideaApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const suffix = '20251106174652';

    // DynamoDB Table
    const productsTable = new dynamodb.Table(this, `ProductsTable${suffix}`, {
      tableName: `Products${suffix}`,
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PROVISIONED,
      readCapacity: 5,
      writeCapacity: 5,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // Enable auto scaling
    productsTable.autoScaleReadCapacity({
      minCapacity: 1,
      maxCapacity: 10,
    }).scaleOnUtilization({
      targetUtilizationPercent: 70,
    });

    productsTable.autoScaleWriteCapacity({
      minCapacity: 1,
      maxCapacity: 10,
    }).scaleOnUtilization({
      targetUtilizationPercent: 70,
    });

    // Lambda Function
    const productsHandler = new lambda.Function(this, `ProductsHandler${suffix}`, {
      functionName: `ProductsHandler${suffix}`,
      runtime: lambda.Runtime.NODEJS_20_X,
      handler: 'index.handler',
      code: lambda.Code.fromAsset('src/lambda'),
      environment: {
        TABLE_NAME: productsTable.tableName,
      },
      timeout: cdk.Duration.seconds(30),
      memorySize: 256,
    });

    // Grant DynamoDB permissions to Lambda
    productsTable.grantReadWriteData(productsHandler);

    // API Gateway
    const api = new apigateway.RestApi(this, `ProductsApi${suffix}`, {
      restApiName: `ProductsApi${suffix}`,
      description: 'API for product specifications',
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ['Content-Type', 'X-Amz-Date', 'Authorization', 'X-Api-Key'],
      },
    });

    const productsResource = api.root.addResource('products');
    const productByIdResource = productsResource.addResource('{id}');

    // Lambda integration
    const lambdaIntegration = new apigateway.LambdaIntegration(productsHandler);

    productsResource.addMethod('GET', lambdaIntegration);
    productByIdResource.addMethod('GET', lambdaIntegration);

    // Output API URL
    new cdk.CfnOutput(this, 'ApiUrl', {
      value: api.url,
      description: 'API Gateway URL',
    });

    new cdk.CfnOutput(this, 'TableName', {
      value: productsTable.tableName,
      description: 'DynamoDB Table Name',
    });
  }
}