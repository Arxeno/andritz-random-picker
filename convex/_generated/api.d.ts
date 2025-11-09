/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as adminSetup from "../adminSetup.js";
import type * as auth from "../auth.js";
import type * as dashboard from "../dashboard.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as participants from "../participants.js";
import type * as prizes from "../prizes.js";
import type * as setup from "../setup.js";
import type * as spin from "../spin.js";
import type * as winners from "../winners.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  adminSetup: typeof adminSetup;
  auth: typeof auth;
  dashboard: typeof dashboard;
  files: typeof files;
  http: typeof http;
  participants: typeof participants;
  prizes: typeof prizes;
  setup: typeof setup;
  spin: typeof spin;
  winners: typeof winners;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
