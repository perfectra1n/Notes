import { Response } from "express";
import type { Express } from "express";

export type InitialThemeCallback = () => "dark" | "light";

export type SetupCompleteCallback = (res: Response) => void;

/**
 * Options needed when the database is first initialized, such as methods to obtain default values.
 */
export interface InitDbOptions {
    /**
     * Called during first setup, in order to determine which theme to set for the user.
     */
    getInitialTheme: InitialThemeCallback;
}

/**
 * Handles differences between clients, for example allowing different behaviour when running from the web server versus the desktop application.
 */
export interface AppConfig extends InitDbOptions {
    /**
     * Called when the express app is built, in order to define additional middleware that might be specific to a web or desktop application.
     * 
     * @param app the express app to add the middleware on.
     */
    registerAdditionalMiddleware: (app: Express) => void;

    /** Callback to be invoked when first setup is complete. */
    setupCompleteCallback: SetupCompleteCallback;            
}
