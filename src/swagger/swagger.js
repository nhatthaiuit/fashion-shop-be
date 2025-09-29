// be/src/swagger/swagger.js (ESM)
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "Fashion Shop API", version: "1.0.0" },
    // Không hard-code localhost. Khi deploy, đặt PUBLIC_BASE_URL trong ENV.
    servers: [{ url: process.env.PUBLIC_BASE_URL || "/" }],
  },
  // Quét comment JSDoc trong các route
  apis: ["./src/routes/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };
