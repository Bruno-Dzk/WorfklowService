import {Architecture, CreateFunctionCommand, LambdaClient, PackageType, Runtime} from "@aws-sdk/client-lambda";
import * as AwsUtils from '../utils/AwsUtils.js';

const LAMBDA_REGION = "eu-central-1";
const LOGGING_ROLE_ARN = "arn:aws:iam::314146339425:role/LambdaBasicExecutionRole";
const SOURCE_CODE_S3_BUCKET = "module-bucket-a60555b5-a452-46d5-8a9f-5248d2dc41a5";
const DUMMY_S3_OBJECT_KEY = "my_deployment_package.zip";

const client = new LambdaClient({
    credentials: AwsUtils.getCredentialProvider(),
    region: LAMBDA_REGION
});

export async function createLambda(
    funcName: string,
) {
    const command = new CreateFunctionCommand({
        Code: {
            S3Bucket: SOURCE_CODE_S3_BUCKET,
            S3Key: DUMMY_S3_OBJECT_KEY
        },
        FunctionName: funcName,
        Role: LOGGING_ROLE_ARN,
        Architectures: [Architecture.x86_64],
        Handler: "lambda_function.lambda_handler",
        PackageType: PackageType.Zip,
        Runtime: Runtime.python311,
    });

    return client.send(command);
}
