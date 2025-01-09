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