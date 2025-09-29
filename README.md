# 🛒 Fashion Shop - Backend

Backend API cho dự án Fashion Shop (Node.js + Express + MongoDB).

---

## 🚀 Yêu cầu hệ thống

- [Git] 2.50.1.windows.1
- [Node.js] v22.19.0
- [npm] 10.9.3
- [MongoDB Atlas] 
- [Postman] để test API

---

## ⚙️ Cách chạy (lần đầu)

1. Clone repo  
   
   git clone https://github.com/nhatthaiuit/fashion-shop-be.git
   cd fashion-shop-be

2. Cài dependency

    npm install

3. Tạo file .env từ mẫu

    cp .env.example .env   # Mac/Linux
    copy .env.example .env # Windows

4. Sửa .env, điền giá trị thật cho MONGO_URI

5. Chạy server

    npm run dev   # chế độ dev
    # hoặc
    npm start     # chế độ production


## ✅ Kiểm tra server (Vào Postman)
 
    import 2 file trong thư mục docs: 
        fashion-shop-local.postman_environment
        fashion-shop-postman-collection
    
    set enviroment: fashion shop local

    Health check:
    GET http://localhost:5000/ → trả về { "message": "Fashion Shop API is running" }

    Lấy danh sách sản phẩm:
    GET http://localhost:5000/api/products → trả về danh sách sản phẩm

    Nạp dữ liệu mẫu:
    POST http://localhost:5000/api/products/seed  → "inserted": 3

## Live URLs
- Web UI: https://fashion-shop-frontend-peach.vercel.app
- API base: https://fashion-shop-backend.onrender.com/
- API Docs (Swagger): https://fashion-shop-backend.onrender.com/docs
