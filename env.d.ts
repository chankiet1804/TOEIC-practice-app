// declare global {
//     namespace NodeJS {
//       interface ProcessEnv {
//         OPENAI_API_KEY: string;
//       }
//     }
//   }
  
// export {};

declare module '@env' {
  export const OPENAI_API_KEY: string;
}

declare namespace NodeJS {
  interface ProcessEnv {
    DB_NAME: string;
    DB_USER: string;
    DB_PASSWORD: string;
    DB_HOST: string;
    DB_DIALECT: "mysql";
  }
}