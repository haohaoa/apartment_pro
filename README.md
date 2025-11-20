# apartment
# Hướng Dẫn Chạy Dự Án Vue.js

## 1. Clone dự án từ Git
\`\`\`sh
git clone <URL của repository>
cd <tên thư mục dự án>
\`\`\`

## 2. Cài đặt Node.js (nếu chưa có)
- Tải và cài đặt từ [Node.js](https://nodejs.org/)
- Kiểm tra phiên bản:
\`\`\`sh
node -v
npm -v
\`\`\`

## 3. Cài đặt dependencies
\`\`\`sh
npm install
\`\`\`

## 4. Chạy dự án
\`\`\`sh
npm run dev
\`\`\`

## 5. Truy cập trình duyệt
Dự án sẽ chạy tại:
\`\`\`
http://localhost:5173/
\`\`\`

# Hướng Dẫn Chạy Dự Án Laravel


## 1. Clone dự án từ Git
\`\`\`sh
git clone <URL của repository>
cd <tên thư mục dự án>
\`\`\`

## 2. Cài đặt môi trường
- Cài đặt PHP từ [php.net](https://www.php.net/downloads)
- Cài đặt Composer từ [getcomposer.org](https://getcomposer.org/)
- Kiểm tra phiên bản:
\`\`\`sh
php -v
composer -V
\`\`\`

## 3. Cài đặt dependencies
\`\`\`sh
composer install
\`\`\`

## 4. Cấu hình môi trường
- Sao chép file .env.example thành .env:
\`\`\`sh
cp .env.example .env
\`\`\`
- Chỉnh sửa thông tin database trong file .env.

## 5. Tạo khóa ứng dụng
\`\`\`sh
php artisan key:generate
\`\`\`

## 6. Chạy migration (nếu có)
\`\`\`sh
php artisan migrate
\`\`\`

## 7. Chạy server Laravel
\`\`\`sh
php artisan serve
\`\`\`
Dự án sẽ chạy tại:
\`\`\`
http://127.0.0.1:8000
\`\`\`

## 8. Xử lý lỗi (nếu có)
- Nếu gặp lỗi về quyền:
\`\`\`sh
chmod -R 777 storage bootstrap/cache
\`\`\`
- Nếu gặp lỗi về cache:
\`\`\`sh
php artisan config:clear
php artisan cache:clear
\`\`\`
" > README.md
# apartment
# apartment_pro
