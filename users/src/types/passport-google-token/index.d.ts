// Type definitions for passport-google-token 0.1
// Project: https://github.com/robertdimarco/passport-google-token#readme
// Definitions by: Ahmed Essawy <https://github.com/me>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

import * as express from "express";
import * as passport from "passport";

export interface Profile extends passport.Profile {
        provider: string;
        id: string;
        displayName: string;
        name: {
            familyName: string;
            givenName: string;
            middleName: string;
        };
        emails: ValueObject[];
    gender: string;
    
        _raw: string;
    _json: any;
}

interface ValueObject {
    value: string;
}

export interface AuthenticateOptions extends passport.AuthenticateOptions {
    authType?: string;
}

export interface StrategyOption {
    clientID: string;
    clientSecret: string;
    callbackURL?: string;

    scopeSeparator?: string;
    enableProof?: boolean;
    profileFields?: string[];
}

export interface StrategyOptionWithRequest extends StrategyOption {
    passReqToCallback: true;
}

export type VerifyFunction =
    (accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any, info?: any) => void) => void;

export type VerifyFunctionWithRequest =
    (req: express.Request, accessToken: string, refreshToken: string, profile: Profile, done: (error: any, user?: any, info?: any) => void) => void;

export class Strategy implements passport.Strategy {
    constructor(options: StrategyOptionWithRequest, verify: VerifyFunctionWithRequest);
    constructor(options: StrategyOption, verify: VerifyFunction);

    name: string;
    authenticate(req: express.Request, options?: object): void;
}
