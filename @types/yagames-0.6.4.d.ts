/// <library version="0.6.4" src="https://github.com/indiesoftby/defold-yagames/archive/refs/tags/0.6.4.zip" />
/** @noSelfInFile **/

/** @noResolution */
declare module 'yagames.yagames' {
  export type Context = unknown;

  export type ApiCallback = (self: Context, err?: string, data?: unknown) => void;

  export function init(callback: ApiCallback): void;

  //* Advertisement

  export interface AdvCallbacks {
    open: (ctx: Context) => void;
    close: (ctx: Context, was_shown: boolean) => void;
    offline: (ctx: Context) => void;
    error: (err: string) => void;
  }
  export function adv_show_fullscreen_adv(callbacks: AdvCallbacks): void;

  export interface RewardedCallbacks {
    open: (ctx: Context) => void;
    rewarded: (ctx: Context) => void;
    close: (ctx: Context) => void;
    error: (ctx: Context, err: string) => void;
  }
  export function adv_show_rewarded_video(callbacks: RewardedCallbacks): void;

  //* Authentication + Player 

  export function auth_open_auth_dialog(callback: ApiCallback): void;

  export interface PlayerInitOptions {
    signed?: boolean;
    scopes?: boolean;
  }
  export function player_init(options: PlayerInitOptions, callback: ApiCallback): void;

  export function player_set_data(data: Record<string, unknown>, flush: boolean, callback: ApiCallback): void;

  export function player_get_data(keys: Array<string> | null, callback: ApiCallback): void;

  export function player_set_stats(stats: Record<string, number>, callback: ApiCallback): void;

  export function player_increment_stats(stats: Record<string, number>, callback: ApiCallback): void;

  export function player_get_stats(keys: Array<string> | null, callback: ApiCallback): void;

  /**
 * @deprecated Use `player_get_unqiue_id` instead.
 */
  export function player_get_id(): string;

  export function player_get_unique_id(): string;

  export function player_get_name(): string;

  export type PlayerGetIdsCallback = (ctx: Context, err?: string, data?: Array<{
    appID: string;
    userID: string;
  }>) => void;
  export function player_get_ids_per_game(callback: PlayerGetIdsCallback): void;

  export function player_get_photo(size: 'small' | 'medium' | 'large'): string;

  //* In-Game Purchases

  export function payments_init(options: { signed?: boolean } | null, callback: ApiCallback): void;

  export interface PaymentsPurchaseOptions {
    id: string;
    developerPayload?: string;
  }
  export type PaymentsPurchaseCallback = (ctx: Context, err?: string, data?: {
    productId: string;
    purchaseToken: string;
    developerPayload: string;
    signature: string;
  }) => void;
  export function payments_purchase(options: PaymentsPurchaseOptions | null, callback: PaymentsPurchaseCallback): void;

  export type PaymentsPurchasesCallback = (ctx: Context, err?: string, data?: {
    purchases: Array<{
      productId: string;
      purchaseToken: string;
      developerPayload: string;
    }>;
    signature: Array<string>;
  }) => void;
  export function payments_get_purchases(callback: PaymentsPurchasesCallback): void;

  export type PaymentsCatalogCallback = (ctx: Context, err?: string, data?: Array<{
    id: string;
    title: string;
    description: string;
    imageURI: string;
    price: string;
    priceValue: string;
    priceCurrencyCode: string;
  }>) => void;
  export function payments_get_catalog(callback: PaymentsCatalogCallback): void;

  export function payments_consume_purchase(purchase_token: string, callback: ApiCallback): void;

  //* Leaderboards

  export function leaderboards_init(callback: ApiCallback): void;

  export type LeaderboardsDescriptionCallback = (ctx: Context, err?: string, data?: {
    appID: string;
    default: boolean;
    description: {
      invert_sort_order: boolean;
      score_format: {
        options: {
          decimal_offset: number;
        }
      }
      type: string;
    }
    name: string;
    title: {
      en: string;
      ru: string;
    }
  }) => void;
  export function leaderboards_get_description(leaderboard_name: string, callback: LeaderboardsDescriptionCallback): void;

  export interface LeaderboardsGetPlayerEntryOptions {
    includeUser?: boolean;
    quantityAround?: number;
    quantityTop?: number;
    getAvatarSrc?: "small" | "medium" | "large";
    getAvatarSrcSet?: "small" | "medium" | "large"
  }
  export function leaderboards_get_player_entry(leaderboard_name: string, options: LeaderboardsGetPlayerEntryOptions | null, callback: ApiCallback): void;

  export type LeaderboardsGetPlayerEntriesCallback = (ctx: Context, err?: string, data?: {
  ranges: [ 
    {
      start: number,
      size: number,
    }
  ],
  userRank: number,
  entries: [  
    {
      score: number,
      extraData: string,
      rank: number,
      player: {
        getAvatarSrc: (size: string) => string,
        getAvatarSrcSet: (size: string) => string,
        lang: string,
        publicName: string,
        scopePermissions: {
          avatar: string,
          public_name: string
        },
        uniqueID: string,
      },
    formattedScore: string
    },
  ]
  }) => void;
  export interface LeaderboardsGetEntriesOptions {
    includeUser?: boolean;
    quantityAround?: number;
    quantityTop?: number;
    getAvatarSrc?: "small" | "medium" | "large";
    getAvatarSrcSet?: "small" | "medium" | "large";
  }
  export function leaderboards_get_entries(leaderboard_name: string, options: LeaderboardsGetEntriesOptions | null, callback: LeaderboardsGetPlayerEntriesCallback): void;

  export function leaderboards_set_score(leaderboard_name: string, score: number, extra_data: string, callback: ApiCallback): void;

  //* Feedback

  export type FeedbackCanReviewCallback = (ctx: Context, err?: string, data?: {
    value: boolean;
    reason: string;
  }) => void;
  export function feedback_can_review(callback: FeedbackCanReviewCallback): void;

  export type FeedbackRequestReviewCallback = (ctx: Context, err?: string, data?: {
    feedbackSent: boolean;
  }) => void;
  export function feedback_request_review(callback: FeedbackCanReviewCallback): void;

  //* Clipboard

  export function clipboard_write_text(text: string, callback?: ApiCallback): void;

  //* Device Info

  export function device_info_type(): "desktop" | "mobile" | "tablet";

  export function device_info_is_desktop(): boolean;

  export function device_info_is_mobile(): boolean;

  export function device_info_is_tablet(): boolean;

  //* Environment

  export interface EnvironmentResults {
    app: {
      id: string;
    }
    browser: {
      lang: string;
    }
    i18n: {
      lang: string;
      tld: string;
    }
    payload?: string;
  }
  export function environment(): EnvironmentResults;

  //* Screen

  export function screen_fullscreen_status(): "on" | "off";

  export function screen_fullscreen_request(callback?: ApiCallback): void;
  
  export function screen_fullscreen_exit(callback?: ApiCallback): void;

  //* Safe Storage

  export function storage_init(callback: ApiCallback): void;

  export function storage_get_item(key: string): string | null;

  export function storage_set_item(key: string, value: string): void;

  export function storage_remove_item(key: string): void;

  export function storage_clear(): void;

  export function storage_key(n: number): string | null;

  export function storage_length(): number;

  //* Banner Ads

  export function banner_init(callback: ApiCallback): void;

  export interface BannerCreateOptions {
    stat_id?: number;
    css_styles?: string;
    css_class?: string;
    display?: "none" | "block";
  }
  export type BannerCreateCallback = (ctx: Context, err?: string, data?: {
    product: "direct" | "rtb";
  }) => void;
  export function banner_create(rtb_id: string, options: BannerCreateOptions, callback?: BannerCreateCallback): void;
  
  export function banner_delete(rtb_id: string): void;
  
  export function banner_refresh(rtb_id: string, callback?: BannerCreateCallback): void;
  
  export function banner_set(rtb_id: string, property: "stat_id" | "css_styles" | "css_class" | "display", value: string): void;

  //* Sitelock
  
  export function add_domain(domain: string): void;
  
  export function verify_domain(): boolean;
  
  export function get_current_domain(): string;
  
  export function is_release_build(): boolean;

 }
