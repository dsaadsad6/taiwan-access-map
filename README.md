# 台灣無障礙地圖（MVP）

群眾協作的台灣無障礙環境地圖：標註店家、捷運站、政府機關、公園等地點的無障礙設施（坡道、電梯、無障礙廁所、無障礙停車位、無階梯入口），任何人可瀏覽，登入後可新增地點/評論，任何人（含匿名）可檢舉不實內容，管理員審核。

## 本機啟動

```bash
npm install
cp .env.example .env
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

開啟 http://localhost:3000

## 開發測試帳號

seed 腳本會建立以下帳號（**僅供本機開發使用，正式環境請勿沿用**）：

| 帳號 | Email | 密碼 | 角色 |
|---|---|---|---|
| 管理員 | admin@example.com | admin1234 | ADMIN |
| 一般使用者 | demo@example.com | demo1234 | USER |

## 功能範圍

- 地圖瀏覽（Leaflet + OpenStreetMap，涵蓋全台灣）+ 分類/設施篩選 + 文字搜尋
- 地點詳情頁：設施標籤、評論列表
- 登入後可新增地點（點地圖定位）、新增評論
- 任何人可檢舉地點/評論（不實、不當、廣告、重複等），檢舉後該筆內容轉為審核中並從公開列表隱藏
- 管理員審核後台（`/admin`）：核准（恢復公開）或駁回（永久隱藏）

明確不做的項目、已知限制、部署前必做的事，見 [`docs/deployment.md`](docs/deployment.md)；地理查詢的擴充路徑見 [`docs/scaling-geo.md`](docs/scaling-geo.md)。

## 技術棧

Next.js 14 (App Router) + TypeScript、Prisma + SQLite、Leaflet + react-leaflet、手刻 DB session 認證（bcryptjs + httpOnly cookie）、Tailwind CSS、Zod。
