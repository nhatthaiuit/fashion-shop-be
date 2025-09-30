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

# Quy trình phát triển dự án như sau:

1. Trên máy local

Sau khi đã thêm/sửa code xong → kiểm tra chạy local:

    npm run dev   # FE
    npm run dev   # BE

Nếu ok → commit vào repo tương ứng:

    git add .
    git commit -m "feat(ui): add Navbar, Home, Products, ProductDetail pages"
    git push origin main

2. Trên GitHub

Vì đã kết nối FE repo với Vercel và BE repo với Render,
mỗi lần push lên branch đang deploy (thường là main),
Vercel/Render sẽ tự động build và deploy lại.

Sau 1–2 phút, refresh link Vercel/Render → sẽ thấy thay đổi ngay.

3. Một số lưu ý

FE (Vercel):

    Chạy npm run build thành công thì mới deploy được.

    Nếu đổi branch deploy, nhớ chọn lại trong Settings của Vercel.

BE (Render):

    Khi push code mới, Render sẽ tự động restart service.

    Nếu BE có thay đổi .env, phải vào Dashboard Render → Environment → Update → Deploy lại.

Cache:

    Đôi khi trình duyệt vẫn giữ CSS/JS cũ → bấm Ctrl + Shift + R (hard refresh).

    Nếu vẫn chưa thấy, vào dashboard Vercel/Render xem log build có lỗi không.

👉 Nói ngắn gọn: commit + push → chờ build → refresh link → thấy ngay thay đổi.



* JWT_SECRET=chuoi_ngau_nhien_rat_dai_va_phuc_tap