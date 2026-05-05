export type LegacyExportErrorType =
    | "LOGIN_REQUIRED"
    | "LOGIN_FAILED"
    | "EXPORT_PAGE_NOT_FOUND"
    | "EXPORT_BUTTON_NOT_FOUND"
    | "DOWNLOAD_TIMEOUT"
    | "ZIP_NOT_FOUND"
    | "PARSE_FAILED"
    | "VAULT_WRITE_FAILED"
    | "UNKNOWN";

export class LegacyExportError extends Error {
    readonly type: LegacyExportErrorType;

    constructor(type: LegacyExportErrorType, message: string) {
        super(message);
        this.type = type;
        this.name = "LegacyExportError";
    }
}

export function toLegacyUserMessage(error: unknown): string {
    if (error instanceof LegacyExportError) {
        switch (error.type) {
            case "LOGIN_REQUIRED":
                return "Legacy export failed: login is required. Please complete login in the opened browser window.";
            case "LOGIN_FAILED":
                return "Legacy export failed: login did not complete successfully.";
            case "EXPORT_PAGE_NOT_FOUND":
                return "Legacy export failed: export page not found. Get may have changed its web page structure.";
            case "EXPORT_BUTTON_NOT_FOUND":
                return "Legacy export failed: export button not found. Get may have changed its web page structure.";
            case "DOWNLOAD_TIMEOUT":
                return "Legacy export failed: download timed out. Please try again.";
            case "ZIP_NOT_FOUND":
                return "Legacy export failed: exported ZIP file was not found.";
            case "PARSE_FAILED":
                return "Legacy import failed: exported data could not be parsed.";
            case "VAULT_WRITE_FAILED":
                return "Legacy import failed: could not write Markdown into the Vault.";
            default:
                return `Legacy export failed: ${error.message}`;
        }
    }

    if (error instanceof Error) {
        return `Legacy export failed: ${error.message}`;
    }

    return `Legacy export failed: ${String(error)}`;
}
