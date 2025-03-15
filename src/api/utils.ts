const { VITE_BASE_API } = import.meta.env;
// nginx
export const baseUrlApi = (url: string) => `${VITE_BASE_API}/${url}`;

// // 一体化部署
// export const baseUrlApi = (url: string) =>
//   process.env.NODE_ENV === "development"
//     ? `/api/${url}`
//     : `http://127.0.0.1:3000/${url}`;
