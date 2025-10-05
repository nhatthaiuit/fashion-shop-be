const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Fashion Shop API",
      version: "1.0.0",
      description: "REST API for Fashion Shop (Products, Auth, Categories)",
    },
    servers: [{ url: process.env.PUBLIC_BASE_URL || "/" }],
  },
  apis: [path.join(__dirname, "routes/*.js")], // ✅ đường dẫn tuyệt đối
};
