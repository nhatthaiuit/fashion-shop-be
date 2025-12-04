// be/src/swagger/swagger.js (ESM)
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fashion Shop API",
      version: "1.0.0",
      description: "API documentation for Fashion Shop e-commerce platform"
    },
    // Không hard-code localhost. Khi deploy, đặt PUBLIC_BASE_URL trong ENV.
    servers: [{ url: process.env.PUBLIC_BASE_URL || "/" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT token"
        }
      }
    }
  },
  // Quét comment JSDoc trong routes và controllers
  apis: ["./src/routes/*.js", "./src/controllers/*.js"],
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };
