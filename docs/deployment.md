# 部署現況與已知限制

專案已部署在 Vercel + Neon Postgres + MapTiler 圖磚，見 README 的「上線環境」章節。這份文件記錄還沒處理、對外開放前該注意的事。

## 已完成

- **資料庫**：Postgres（Neon），透過 Vercel 的 Neon Marketplace 整合建立，`DATABASE_URL` 等環境變數已同步到 Production/Preview/Development。
- **地圖圖磚**：`NEXT_PUBLIC_TILE_URL` 已換成 MapTiler（`streets-v2` 樣式），不再用 OSM 官方免費圖磚伺服器（其使用政策不允許正式流量）。`MapView.tsx` 裡的 OpenStreetMap 版權標註（`attribution`）依然保留——這是 OSM 資料的 ODbL 授權要求，不是可選項，換圖磚來源不影響這個義務。
- **CI**：GitHub Actions 在每次 push/PR 跑型別檢查與 build（`.github/workflows/ci.yml`）。
- **自動部署**：GitHub repo 已連接 Vercel，push 到 `master` 會自動觸發 Production 部署。

## 目前已知、故意延後處理的限制

這些都記錄在計畫裡，故意不在 MVP 階段做，但正式對外開放、有真實使用者流量前應該補上：
- 沒有 Email 驗證
- 沒有忘記密碼流程
- 沒有速率限制（rate limiting）/ CAPTCHA，註冊、登入、檢舉這幾個端點都可能被濫用
- 密碼 session 是 30 天固定效期，沒有滑動更新或登出所有裝置的功能
- 沒有照片上傳
- MapTiler 免費額度每月 10 萬次圖磚請求，流量成長後需要留意額度或升級方案
