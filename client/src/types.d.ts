declare interface Window {
    logError(message: string);
    logInfo(message: string);
}

declare var logError: (message: string) => void;
declare var logInfo: (message: string) => void;