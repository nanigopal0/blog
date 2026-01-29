export enum AuthProvider {
    LOCAL = "LOCAL",
    GOOGLE = "GOOGLE"
}

export type AuthProviderResponse = {
    authModeId: number;
    authProviderName: AuthProvider;
}