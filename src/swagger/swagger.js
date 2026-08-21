// be/src/swagger/swagger.js (ESM)
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fashion Shop API",
      version: "1.0.0",
      description: "API documentation for Fashion Shop e-commerce platform"
    },
    servers: [
      { url: process.env.PUBLIC_BASE_URL || "/" },
      { url: "https://fashion-shop-be-one.vercel.app" },
      { url: "http://localhost:4000" }
    ],
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
  // Quét comment JSDoc với cả absolute path và relative path
  apis: [
    path.join(__dirname, "../routes/*.js"),
    path.join(__dirname, "../controllers/*.js"),
    "./src/routes/*.js",
    "./src/controllers/*.js"
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };
