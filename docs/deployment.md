# 部署前必做的事

這個專案目前是本機開發用的 MVP 雛形，**在部署到任何公開或共享環境之前**，至少要處理以下事項：

## 1. 換掉 OSM 圖磚來源

`.env` 裡的 `NEXT_PUBLIC_TILE_URL` 預設指向 `tile.openstreetmap.org`，這是 OpenStreetMap 官方免費提供給輕量測試/評估用的圖磚伺服器，其使用政策明確禁止大量或商業用途，不適合任何有實際流量的部署。

換成以下其中一個（都有免費額度、不需要信用卡）：
- **MapTiler**：每月 10 萬次免費圖磚請求
- **Stadia Maps**：非商業/小型使用免費

換法：申請 API key 後，把 `.env` 的 `NEXT_PUBLIC_TILE_URL` 換成對應服務的圖磚網址即可，不需要改程式碼。

無論用哪個圖磚來源，`MapView.tsx` 裡的 OpenStreetMap 版權標註（`attribution`）都要保留——這是 OSM 資料的 ODbL 授權要求，不是可選項。

## 2. 換成 Postgres

SQLite（`prisma/dev.db`）只適合本機開發。正式部署要換成 Postgres：把 `datasource` 的 `provider` 改成 `"postgresql"`，`DATABASE_URL` 指向正式的 Postgres 連線字串，重新跑一次 `prisma migrate deploy`。

## 3. 目前已知、故意延後處理的 MVP 限制

這些都記錄在計畫裡，故意不在 MVP 階段做，但正式對外開放前應該補上：
- 沒有 Email 驗證
- 沒有忘記密碼流程
- 沒有速率限制（rate limiting）/ CAPTCHA，註冊、登入、檢舉這幾個端點都可能被濫用
- 密碼 session 是 30 天固定效期，沒有滑動更新或登出所有裝置的功能
- 沒有照片上傳
