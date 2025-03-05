import {fromContainerMetadata, fromEnv} from "@aws-sdk/credential-providers";

export function getCredentialProvider() {
    if (process.env.ENV === "dev") {
        return fromEnv();
    } else {
        return fromContainerMetadata({
            timeout: 1000,
            maxRetries: 3
        })
    }
}