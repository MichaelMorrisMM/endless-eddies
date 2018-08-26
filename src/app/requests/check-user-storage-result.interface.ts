export interface CheckUserStorageResult {
    readonly storageUsed?: number;
    readonly limitExceeded?: boolean;
    readonly error?: string;
}
