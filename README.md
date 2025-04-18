# Frontend - Next.js

## 📦 Tech Stack
- [NextJS](https://nextjs.org)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Dotenv](https://www.npmjs.com/package/dotenv)

---

## 🚀 วิธีติดตั้งและรันโปรเจกต์

### 1. Clone โปรเจกต์
```bash
git clone https://github.com/zuyaxiii/LookFront.git
cd LookFront
```

### 2. ติดตั้ง dependencies
```bash
npm install
```
### 3. สร้างไฟล์ .env.local
สร้างไฟล์ .env.local ที่ root ของโปรเจกต์ แล้วใส่ค่าแบบนี้:
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
```
📝 หมายเหตุ:
- ถ้า backend รันอยู่บนพอร์ตอื่น หรืออยู่บน server จริง ให้แก้ URL ตามจริง

### 4. รันโปรเจกต์
```bash
npm run dev
```
