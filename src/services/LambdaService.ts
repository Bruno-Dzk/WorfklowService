import * as LambdaClient from '../clients/LambdaClient.js';

export async function createLambda(funcName: string) {
    await LambdaClient.createLambda(funcName);
}