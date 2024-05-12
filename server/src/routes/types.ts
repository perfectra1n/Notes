import { Response } from "express";

export type SetupCompleteCallback = (res: Response) => void;

export interface RouteConfig {
    /** Callback to be invoked when first setup is complete. */
    setupCompleteCallback: SetupCompleteCallback;        
}