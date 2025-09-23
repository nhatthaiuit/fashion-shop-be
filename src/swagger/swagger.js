import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fashion Shop API",
      version: "1.0.0",
      description: "REST API for a simple clothing store"
    },
    servers: [{ url: "http://localhost:5000" }]
  },
  apis: []
};

export const swaggerSpec = swaggerJSDoc(options);
export { swaggerUi };
