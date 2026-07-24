# 地理查詢的擴充路徑（Postgres + PostGIS）

目前 MVP 用 SQLite，地點的地理查詢（地圖可視範圍內的地點、最近地點）都是用 `latitude`/`longitude` 兩個 `Float` 欄位做 bounding-box range query（見 `src/lib/geo.ts`），在幾百到幾千筆資料的規模下效能完全足夠，不需要額外的空間索引。

當地點數量成長到需要真正的空間索引時（大約數萬筆以上，或需要精準的「以某點為圓心搜尋半徑內地點」查詢），升級路徑如下：

1. 把 `DATABASE_URL` 換成 Postgres 連線字串，啟用 `postgis` extension。
2. 在 `Place` model 新增一個 `Unsupported("geography(Point, 4326)")` 欄位（Prisma 目前對 PostGIS 型別沒有原生支援，需要用 `Unsupported` 搭配手寫 migration SQL）。
3. 寫一個一次性 migration，把既有的 `latitude`/`longitude` 資料回填到新的 geography 欄位。
4. 幫這個欄位建立 GiST 索引。
5. 把 bounding-box 查詢改成 `ST_Contains`，最近地點查詢改成 `ST_DWithin` + `ORDER BY ST_Distance(...)`。

在真的需要之前不要提前做這件事——目前的 bounding-box + 應用層 Haversine（`haversineDistanceKm`）已經足夠支撐 MVP 的規模。
