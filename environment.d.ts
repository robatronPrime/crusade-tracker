declare global {
  namespace NodeJS {
    interface ProcessEnv {
      GITHUB_AUTH_TOKEN: string;
      NODE_ENV: "development" | "production";
      PORT?: string;
      PWD: string;
      AUTH0_ID: string;
      AUTH0_SECRET: string;
      AUTH0_DOMAIN: string;
      FACEBOOK_ID: string;
      FACEBOOK_SECRET: string;
      GITHUB_ID: string;
      GITHUB_SECRET: string;
      GOOGLE_ID: string;
      GOOGLE_SECRET: string;
      TWITTER_ID: string;
      TWITTER_SECRET: string;
      SECRET: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
