import React, { useState, useMemo, useEffect } from 'react';
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { 
  TrendingUp, DollarSign, Star, ShoppingCart, 
  Filter, AlertCircle, RefreshCw, Upload, FileSpreadsheet, CheckCircle
} from 'lucide-react';

const COLORS = ['#315c46', '#d19a52', '#8ca99a', '#b96d52', '#7e8f75', '#9a8b79', '#c6ad7d', '#59796a'];

// =======================================================================================
// 👉 นำข้อมูลจากไฟล์ CSV ของคุณมาวางทับข้อความระหว่างเครื่องหมาย ` ` (Backticks) ด้านล่างนี้ได้เลยครับ 
// ให้ขึ้นบรรทัดแรกเป็น Header ปกติเหมือนในไฟล์ CSV เลยครับ
// ตัวอย่างเช่น:
// Transaction_ID,Date,Time,Day_of_Week,...
// T0001,2026-02-24,12:00,Tue,...
// =======================================================================================

const EMBEDDED_CSV_DATA = `Transaction_ID,Date,Time,Day_of_Week,Month,Daypart,Customer_ID,Age,Gender,Customer_Type,Membership,Product,Category,Quantity,Unit_Price,Gross_Sales,Discount,Net_Sales,Total_Cost,Profit,Profit_Margin,Channel,Payment,Promotion,Campaign,Location,Customer_Rating
T0001,2026-02-24,12:00,Tue,Feb,Lunch,C0228,43,Female,New,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,Grab,QR,None,None,Huai Yot,4.6
T0002,2026-04-17,14:45,Fri,Apr,Afternoon,C0019,20,Female,New,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,35.70,29.30,45.1%,Grab,Card,None,None,Trang City,4.2
T0003,2026-05-18,09:50,Mon,May,Morning,C0268,21,Male,Returning,Yes,Matcha Latte,Tea,2,85.00,170.00,0.00,170.00,64.00,106.00,62.4%,Store,QR,None,None,Huai Yot,4.4
T0004,2026-05-18,21:50,Mon,May,Evening,C0178,24,Male,Returning,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,33.00,52.00,61.2%,Store,QR,None,None,Trang City,4.1
T0005,2026-02-28,12:35,Sat,Feb,Lunch,C0276,25,Male,New,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,35.70,29.30,45.1%,ShopeeFood,Card,None,None,Kantang,3.8
T0006,2026-05-12,13:10,Tue,May,Lunch,C0234,18,Female,Returning,Yes,French Fries,Snack,2,69.00,138.00,0.00,138.00,68.90,69.10,50.1%,LINE,QR,None,None,Trang City,4.1
T0007,2026-04-12,10:35,Sun,Apr,Morning,C0308,40,Male,Returning,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,QR,None,None,Kantang,4.0
T0008,2026-05-11,14:40,Mon,May,Afternoon,C0003,29,Female,Returning,Yes,Matcha Latte,Tea,3,85.00,255.00,0.00,255.00,141.90,113.10,44.4%,Grab,Cash,None,None,Trang City,3.9
T0009,2026-01-25,19:45,Sun,Jan,Evening,C0333,33,Male,Returning,No,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,25.00,30.00,54.6%,Store,QR,None,None,Trang City,4.5
T0010,2026-06-14,20:00,Sun,Jun,Evening,C0356,23,Female,New,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,13.35,75.65,58.62,17.03,22.5%,ShopeeFood,QR,Combo 15%,Weekend Boost,Huai Yot,4.2
T0011,2026-01-13,09:25,Tue,Jan,Morning,C0326,42,Male,Returning,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,22.00,43.00,66.2%,Store,QR,None,None,Trang City,3.8
T0012,2026-02-28,13:10,Sat,Feb,Lunch,C0044,18,Female,VIP,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,ShopeeFood,Cash,None,None,Trang City,3.3
T0013,2026-02-23,10:05,Mon,Feb,Morning,C0190,38,Male,New,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,28.50,41.50,59.3%,LINE,QR,None,None,Trang City,4.0
T0014,2026-06-06,17:25,Sat,Jun,Afternoon,C0036,21,Female,Returning,No,Iced Latte,Coffee,2,75.00,150.00,22.50,127.50,56.00,71.50,56.1%,Store,Cash,Combo 15%,Weekend Boost,Trang City,4.4
T0015,2026-02-14,12:10,Sat,Feb,Lunch,C0026,51,Male,Returning,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,27.25,37.75,58.1%,LINE,QR,None,None,Trang City,4.5
T0016,2026-03-13,12:30,Fri,Mar,Lunch,C0205,25,Female,VIP,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,25.00,45.00,64.3%,Store,QR,None,None,Huai Yot,4.5
T0017,2026-02-28,12:35,Sat,Feb,Lunch,C0323,30,Male,New,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,8.90,80.10,59.42,20.68,25.8%,Grab,QR,10% Discount,Payday,Trang City,4.2
T0018,2026-05-21,10:10,Thu,May,Morning,C0199,26,Male,Returning,Yes,Americano,Coffee,1,65.00,65.00,0.00,65.00,33.70,31.30,48.2%,ShopeeFood,Cash,None,None,Kantang,4.2
T0019,2026-05-31,18:50,Sun,May,Evening,C0153,20,Male,VIP,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,32.00,53.00,62.4%,Store,Card,None,None,Kantang,4.1
T0020,2026-06-07,17:45,Sun,Jun,Afternoon,C0266,20,Female,Returning,Yes,Iced Latte,Coffee,3,75.00,225.00,0.00,225.00,95.25,129.75,57.7%,LINE,QR,None,None,Trang City,4.2
T0021,2026-03-06,11:40,Fri,Mar,Lunch,C0357,20,Female,VIP,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,Card,None,None,Kantang,4.6
T0022,2026-01-25,11:00,Sun,Jan,Lunch,C0148,21,Female,VIP,No,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,47.50,27.50,36.7%,Grab,QR,None,None,Kantang,3.9
T0023,2026-03-25,19:35,Wed,Mar,Evening,C0341,32,Female,Returning,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,25.00,45.00,64.3%,Store,QR,None,None,Trang City,4.3
T0024,2026-02-21,17:25,Sat,Feb,Afternoon,C0120,54,Female,VIP,Yes,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,24.00,41.00,63.1%,Store,QR,None,None,Huai Yot,4.4
T0025,2026-01-17,11:40,Sat,Jan,Lunch,C0075,25,Female,Returning,Yes,Peach Tea,Tea,2,70.00,140.00,21.00,119.00,71.42,47.58,40.0%,Grab,QR,Combo 15%,Weekend Boost,Huai Yot,3.9
T0026,2026-05-08,17:45,Fri,May,Afternoon,C0028,18,Female,Returning,Yes,Ham Cheese Sandwich,Snack,2,89.00,178.00,0.00,178.00,122.04,55.96,31.4%,Grab,Card,None,None,Kantang,4.2
T0027,2026-04-12,17:40,Sun,Apr,Afternoon,C0100,26,Female,Returning,Yes,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,37.60,32.40,46.3%,Grab,QR,None,None,Trang City,4.5
T0028,2026-04-08,17:00,Wed,Apr,Afternoon,C0183,21,Male,New,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,Grab,Cash,None,None,Trang City,3.9
T0029,2026-01-20,13:20,Tue,Jan,Lunch,C0314,39,Female,VIP,Yes,Butter Croissant,Bakery,2,55.00,110.00,0.00,110.00,50.00,60.00,54.6%,Store,QR,None,None,Trang City,4.2
T0030,2026-01-19,09:40,Mon,Jan,Morning,C0053,38,Female,Returning,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,37.25,47.75,56.2%,LINE,QR,None,None,Huai Yot,4.9
T0031,2026-06-10,21:25,Wed,Jun,Evening,C0163,23,Female,New,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,ShopeeFood,QR,None,None,Trang City,3.8
T0032,2026-01-17,12:30,Sat,Jan,Lunch,C0167,31,Male,Returning,Yes,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,47.50,27.50,36.7%,Grab,Cash,None,None,Trang City,4.3
T0033,2026-05-14,21:15,Thu,May,Evening,C0041,20,Female,New,No,Thai Tea,Tea,2,65.00,130.00,0.00,130.00,71.40,58.60,45.1%,Grab,Card,None,None,Kantang,3.9
T0034,2026-01-18,13:55,Sun,Jan,Lunch,C0140,19,Female,New,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,ShopeeFood,Cash,None,None,Huai Yot,4.3
T0035,2026-02-24,21:35,Tue,Feb,Evening,C0132,21,Male,Returning,Yes,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,37.60,32.40,46.3%,Grab,Cash,None,None,Trang City,4.1
T0036,2026-06-09,16:05,Tue,Jun,Afternoon,C0067,34,Female,New,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,24.00,41.00,63.1%,Store,Cash,None,None,Huai Yot,3.9
T0037,2026-03-14,20:20,Sat,Mar,Evening,C0020,23,Male,Returning,Yes,Americano,Coffee,1,65.00,65.00,6.50,58.50,32.53,25.97,44.4%,Grab,QR,10% Discount,Student Deal,Trang City,3.9
T0038,2026-05-05,14:45,Tue,May,Afternoon,C0096,55,Male,New,No,Ham Cheese Sandwich,Snack,2,89.00,178.00,0.00,178.00,122.04,55.96,31.4%,Grab,QR,None,None,Trang City,3.8
T0039,2026-06-16,15:35,Tue,Jun,Afternoon,C0097,30,Male,New,No,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,25.00,30.00,54.6%,Store,QR,None,None,Trang City,4.1
T0040,2026-04-25,17:30,Sat,Apr,Afternoon,C0162,32,Male,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,7.50,67.50,28.00,39.50,58.5%,Store,Card,10% Discount,Payday,Trang City,4.4
T0041,2026-04-16,09:55,Thu,Apr,Morning,C0218,39,Female,VIP,Yes,Iced Latte,Coffee,1,75.00,75.00,11.25,63.75,39.47,24.28,38.1%,Grab,Card,Combo 15%,Member Exclusive,Huai Yot,4.0
T0042,2026-03-12,16:00,Thu,Mar,Afternoon,C0121,31,Male,VIP,Yes,Butter Croissant,Bakery,2,55.00,110.00,0.00,110.00,50.00,60.00,54.6%,Store,QR,None,None,Trang City,4.4
T0043,2026-06-25,21:15,Thu,Jun,Evening,C0144,21,Female,Returning,No,Peach Tea,Tea,1,70.00,70.00,7.00,63.00,36.34,26.66,42.3%,Grab,QR,10% Discount,Student Deal,Trang City,4.4
T0044,2026-03-31,15:20,Tue,Mar,Afternoon,C0073,26,Female,New,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,22.00,43.00,66.2%,Store,QR,None,None,Trang City,4.4
T0045,2026-02-17,09:00,Tue,Feb,Morning,C0052,33,Male,New,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,22.00,43.00,66.2%,Store,Cash,None,None,Trang City,4.3
T0046,2026-01-16,18:05,Fri,Jan,Evening,C0221,18,Female,Returning,Yes,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,ShopeeFood,Card,None,None,Trang City,4.6
T0047,2026-05-06,09:05,Wed,May,Morning,C0332,18,Male,Returning,Yes,Caramel Macchiato,Coffee,2,85.00,170.00,0.00,170.00,74.50,95.50,56.2%,LINE,QR,None,None,Trang City,4.0
T0048,2026-04-16,10:25,Thu,Apr,Morning,C0184,26,Female,VIP,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,22.00,43.00,66.2%,Store,QR,None,None,Huai Yot,3.9
T0049,2026-01-30,18:40,Fri,Jan,Evening,C0208,22,Male,Returning,No,Americano,Coffee,1,65.00,65.00,6.50,58.50,32.53,25.97,44.4%,ShopeeFood,QR,10% Discount,Payday,Trang City,3.3
T0050,2026-05-25,09:40,Mon,May,Morning,C0010,38,Male,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,8.90,80.10,45.00,35.10,43.8%,Store,QR,10% Discount,Payday,Huai Yot,4.3
T0051,2026-05-22,11:25,Fri,May,Lunch,C0287,25,Female,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,Grab,QR,None,None,Huai Yot,4.3
T0052,2026-01-15,14:35,Thu,Jan,Afternoon,C0200,25,Female,Returning,Yes,Chocolate Cake,Bakery,3,75.00,225.00,0.00,225.00,113.25,111.75,49.7%,LINE,QR,None,None,Kantang,3.5
T0053,2026-02-01,12:30,Sun,Feb,Lunch,C0318,33,Female,Returning,Yes,Americano,Coffee,1,65.00,65.00,9.75,55.25,31.95,23.30,42.2%,Grab,QR,Combo 15%,Weekend Boost,Trang City,3.9
T0054,2026-06-07,16:05,Sun,Jun,Afternoon,C0104,21,Male,Returning,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,48.30,36.70,43.2%,Grab,QR,None,None,Trang City,4.3
T0055,2026-03-08,08:25,Sun,Mar,Morning,C0177,27,Female,VIP,Yes,Matcha Latte,Tea,2,85.00,170.00,25.50,144.50,90.01,54.49,37.7%,Grab,QR,Combo 15%,Member Exclusive,Trang City,3.2
T0056,2026-03-23,15:25,Mon,Mar,Afternoon,C0358,23,Female,New,No,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,34.90,20.10,36.6%,ShopeeFood,Card,None,None,Kantang,4.2
T0057,2026-05-03,19:10,Sun,May,Evening,C0105,19,Female,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,33.75,41.25,56.00,-14.75,-35.8%,Store,Cash,Buy 1 Get 1,Student Deal,Huai Yot,4.5
T0058,2026-06-24,09:10,Wed,Jun,Morning,C0258,34,Female,Returning,Yes,Americano,Coffee,1,65.00,65.00,0.00,65.00,22.00,43.00,66.2%,Store,QR,None,None,Trang City,4.4
T0059,2026-02-28,09:45,Sat,Feb,Morning,C0286,36,Female,VIP,Yes,Americano,Coffee,1,65.00,65.00,9.75,55.25,22.00,33.25,60.2%,Store,Card,Combo 15%,Member Exclusive,Trang City,3.2
T0060,2026-01-22,10:15,Thu,Jan,Morning,C0336,40,Female,New,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,28.50,41.50,59.3%,LINE,QR,None,None,Huai Yot,4.4
T0061,2026-04-17,19:35,Fri,Apr,Evening,C0264,24,Female,New,No,Ham Cheese Sandwich,Snack,2,89.00,178.00,0.00,178.00,122.04,55.96,31.4%,ShopeeFood,QR,None,None,Kantang,4.4
T0062,2026-02-15,21:35,Sun,Feb,Evening,C0054,24,Female,New,No,French Fries,Snack,1,69.00,69.00,6.90,62.10,31.00,31.10,50.1%,Store,Card,10% Discount,Student Deal,Trang City,5.0
T0063,2026-03-01,09:40,Sun,Mar,Morning,C0074,33,Female,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,45.00,44.00,49.4%,Store,Card,None,None,Trang City,3.5
T0064,2026-06-21,09:20,Sun,Jun,Morning,C0354,34,Male,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,31.75,43.25,57.7%,LINE,QR,None,None,Kantang,4.2
T0065,2026-01-15,13:30,Thu,Jan,Lunch,C0029,42,Male,Returning,No,Matcha Latte,Tea,2,85.00,170.00,0.00,170.00,94.60,75.40,44.4%,ShopeeFood,Card,None,None,Trang City,4.5
T0066,2026-02-17,18:25,Tue,Feb,Evening,C0072,18,Male,Returning,No,French Fries,Snack,2,69.00,138.00,0.00,138.00,68.90,69.10,50.1%,LINE,QR,None,None,Kantang,4.3
T0067,2026-04-17,09:10,Fri,Apr,Morning,C0091,34,Male,Returning,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,35.70,29.30,45.1%,Grab,QR,None,None,Huai Yot,4.6
T0068,2026-02-12,19:30,Thu,Feb,Evening,C0132,32,Female,Returning,Yes,Americano,Coffee,1,65.00,65.00,0.00,65.00,22.00,43.00,66.2%,Store,QR,None,None,Trang City,4.9
T0069,2026-03-07,09:05,Sat,Mar,Morning,C0354,23,Male,Returning,No,Caramel Macchiato,Coffee,3,85.00,255.00,0.00,255.00,99.00,156.00,61.2%,Store,Card,None,None,Kantang,3.8
T0070,2026-06-14,13:50,Sun,Jun,Lunch,C0198,18,Female,Returning,No,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,47.50,27.50,36.7%,ShopeeFood,Cash,None,None,Trang City,3.9
T0071,2026-04-05,17:20,Sun,Apr,Afternoon,C0334,18,Female,New,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,24.00,41.00,63.1%,Store,QR,None,None,Trang City,4.4
T0072,2026-02-24,19:40,Tue,Feb,Evening,C0303,21,Male,Returning,Yes,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,47.50,27.50,36.7%,ShopeeFood,QR,None,None,Trang City,4.3
T0073,2026-03-08,12:00,Sun,Mar,Lunch,C0118,45,Male,New,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,Cash,None,None,Trang City,4.4
T0074,2026-02-01,20:10,Sun,Feb,Evening,C0294,19,Female,VIP,No,Caramel Macchiato,Coffee,1,85.00,85.00,12.75,72.25,46.00,26.25,36.3%,ShopeeFood,Cash,Combo 15%,Member Exclusive,Trang City,4.2
T0075,2026-03-04,19:30,Wed,Mar,Evening,C0266,50,Female,Returning,Yes,Butter Croissant,Bakery,2,55.00,110.00,0.00,110.00,55.50,54.50,49.6%,LINE,Card,None,None,Kantang,4.2
T0076,2026-03-16,18:55,Mon,Mar,Evening,C0153,24,Male,New,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,48.30,36.70,43.2%,ShopeeFood,QR,None,None,Trang City,4.6
T0077,2026-02-07,08:50,Sat,Feb,Morning,C0167,21,Male,New,No,French Fries,Snack,1,69.00,69.00,0.00,69.00,31.00,38.00,55.1%,Store,Card,None,None,Trang City,3.9
T0078,2026-06-05,20:55,Fri,Jun,Evening,C0240,23,Male,VIP,Yes,Thai Tea,Tea,2,65.00,130.00,0.00,130.00,71.40,58.60,45.1%,Grab,QR,None,None,Huai Yot,4.1
T0079,2026-06-01,12:15,Mon,Jun,Lunch,C0124,39,Male,New,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,45.00,44.00,49.4%,Store,QR,None,None,Trang City,4.4
T0080,2026-04-20,10:40,Mon,Apr,Morning,C0044,45,Male,Returning,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,Card,None,None,Trang City,4.3
T0081,2026-03-30,17:55,Mon,Mar,Afternoon,C0113,42,Female,Returning,Yes,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,47.50,27.50,36.7%,Grab,QR,None,None,Huai Yot,4.4
T0082,2026-01-28,17:15,Wed,Jan,Afternoon,C0175,55,Female,VIP,Yes,Peach Tea,Tea,2,70.00,140.00,14.00,126.00,72.68,53.32,42.3%,Grab,QR,10% Discount,Payday,Trang City,3.9
T0083,2026-05-29,10:35,Fri,May,Morning,C0263,40,Female,Returning,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,32.00,53.00,62.4%,Store,QR,None,None,Trang City,4.6
T0084,2026-03-15,21:20,Sun,Mar,Evening,C0284,22,Female,Returning,Yes,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,36.25,48.75,57.4%,LINE,QR,None,None,Trang City,4.0
T0085,2026-05-04,12:15,Mon,May,Lunch,C0168,24,Male,Returning,Yes,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,48.30,36.70,43.2%,Grab,QR,None,None,Trang City,4.2
T0086,2026-04-09,20:05,Thu,Apr,Evening,C0259,24,Male,Returning,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,Grab,Card,None,None,Huai Yot,3.9
T0087,2026-03-11,20:50,Wed,Mar,Evening,C0046,20,Female,New,No,Chocolate Cake,Bakery,2,75.00,150.00,15.00,135.00,92.30,42.70,31.6%,Grab,Card,10% Discount,Student Deal,Huai Yot,4.1
T0088,2026-05-15,10:50,Fri,May,Morning,C0285,32,Male,New,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,36.25,48.75,57.4%,LINE,QR,None,None,Trang City,4.5
T0089,2026-04-30,20:45,Thu,Apr,Evening,C0276,22,Female,Returning,No,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,34.90,20.10,36.6%,ShopeeFood,QR,None,None,Trang City,4.3
T0090,2026-04-11,11:35,Sat,Apr,Lunch,C0248,34,Male,Returning,Yes,Iced Latte,Coffee,2,75.00,150.00,22.50,127.50,56.00,71.50,56.1%,Store,Card,Combo 15%,Weekend Boost,Trang City,4.5
T0091,2026-03-19,19:05,Thu,Mar,Evening,C0066,19,Female,New,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,35.70,29.30,45.1%,Grab,QR,None,None,Trang City,4.1
T0092,2026-04-24,10:55,Fri,Apr,Morning,C0042,46,Female,VIP,Yes,Matcha Latte,Tea,1,85.00,85.00,12.75,72.25,32.00,40.25,55.7%,Store,Card,Combo 15%,Member Exclusive,Trang City,4.4
T0093,2026-03-19,12:15,Thu,Mar,Lunch,C0112,45,Female,Returning,Yes,Americano,Coffee,2,65.00,130.00,0.00,130.00,44.00,86.00,66.2%,Store,Card,None,None,Trang City,4.4
T0094,2026-04-14,21:35,Tue,Apr,Evening,C0060,27,Female,Returning,Yes,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,33.00,52.00,61.2%,Store,Cash,None,None,Trang City,4.5
T0095,2026-03-14,16:15,Sat,Mar,Afternoon,C0086,22,Female,Returning,No,Iced Latte,Coffee,1,75.00,75.00,11.25,63.75,39.47,24.28,38.1%,ShopeeFood,QR,Combo 15%,Weekend Boost,Trang City,3.7
T0096,2026-03-13,20:45,Fri,Mar,Evening,C0238,23,Female,Returning,Yes,Americano,Coffee,1,65.00,65.00,29.25,35.75,50.43,-14.68,-41.1%,Grab,Cash,Buy 1 Get 1,Student Deal,Trang City,5.0
T0097,2026-06-20,10:50,Sat,Jun,Morning,C0116,27,Female,Returning,Yes,French Fries,Snack,2,69.00,138.00,0.00,138.00,68.90,69.10,50.1%,LINE,Cash,None,None,Trang City,4.2
T0098,2026-04-19,19:30,Sun,Apr,Evening,C0258,21,Female,Returning,Yes,Butter Croissant,Bakery,2,55.00,110.00,22.00,88.00,90.84,-2.84,-3.2%,Grab,QR,Buy 1 Get 1,Student Deal,Trang City,4.0
T0099,2026-02-25,14:50,Wed,Feb,Afternoon,C0048,41,Male,Returning,Yes,Caramel Macchiato,Coffee,2,85.00,170.00,0.00,170.00,96.60,73.40,43.2%,Grab,Cash,None,None,Trang City,4.1
T0100,2026-04-18,17:55,Sat,Apr,Afternoon,C0242,23,Female,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,35.70,29.30,45.1%,Grab,QR,None,None,Trang City,4.8
T0101,2026-03-13,19:45,Fri,Mar,Evening,C0138,22,Female,New,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,37.60,32.40,46.3%,Grab,QR,None,None,Trang City,4.3
T0102,2026-06-24,17:45,Wed,Jun,Afternoon,C0070,24,Male,Returning,No,Chocolate Cake,Bakery,2,75.00,150.00,0.00,150.00,68.00,82.00,54.7%,Store,Cash,None,None,Trang City,4.4
T0103,2026-01-09,16:55,Fri,Jan,Afternoon,C0259,22,Female,Returning,Yes,Iced Latte,Coffee,3,75.00,225.00,0.00,225.00,84.00,141.00,62.7%,Store,Card,None,None,Trang City,3.6
T0104,2026-03-23,14:30,Mon,Mar,Afternoon,C0290,23,Male,New,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,33.70,31.30,48.2%,ShopeeFood,QR,None,None,Huai Yot,3.1
T0105,2026-04-18,19:35,Sat,Apr,Evening,C0360,24,Male,Returning,No,Iced Latte,Coffee,3,75.00,225.00,0.00,225.00,124.50,100.50,44.7%,Grab,QR,None,None,Trang City,4.4
T0106,2026-05-11,15:35,Mon,May,Afternoon,C0022,21,Female,New,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,36.25,48.75,57.4%,LINE,Card,None,None,Trang City,4.6
T0107,2026-02-19,15:55,Thu,Feb,Afternoon,C0244,54,Female,Returning,Yes,Chocolate Cake,Bakery,2,75.00,150.00,0.00,150.00,75.50,74.50,49.7%,LINE,QR,None,None,Trang City,4.4
T0108,2026-02-11,13:30,Wed,Feb,Lunch,C0175,42,Female,New,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,Grab,QR,None,None,Kantang,3.9
T0109,2026-05-22,12:20,Fri,May,Lunch,C0040,32,Male,Returning,Yes,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,28.50,41.50,59.3%,LINE,QR,None,None,Trang City,4.6
T0110,2026-05-18,18:40,Mon,May,Evening,C0325,25,Female,Returning,Yes,Americano,Coffee,1,65.00,65.00,0.00,65.00,33.70,31.30,48.2%,Grab,QR,None,None,Trang City,4.3
T0111,2026-05-11,14:20,Mon,May,Afternoon,C0306,20,Female,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,34.90,20.10,36.6%,ShopeeFood,QR,None,None,Huai Yot,3.9
T0112,2026-01-24,16:15,Sat,Jan,Afternoon,C0299,34,Male,Returning,No,Butter Croissant,Bakery,2,55.00,110.00,0.00,110.00,50.00,60.00,54.6%,Store,Card,None,None,Trang City,4.0
T0113,2026-01-11,20:05,Sun,Jan,Evening,C0319,23,Male,Returning,No,Iced Latte,Coffee,1,75.00,75.00,7.50,67.50,40.15,27.35,40.5%,Grab,QR,10% Discount,Student Deal,Trang City,4.7
T0114,2026-02-13,21:55,Fri,Feb,Evening,C0115,21,Female,Returning,Yes,Chocolate Cake,Bakery,2,75.00,150.00,0.00,150.00,68.00,82.00,54.7%,Store,QR,None,None,Trang City,4.5
T0115,2026-04-26,13:05,Sun,Apr,Lunch,C0292,25,Female,Returning,Yes,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,25.00,45.00,64.3%,Store,QR,None,None,Trang City,4.6
T0116,2026-04-14,10:00,Tue,Apr,Morning,C0030,20,Male,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,QR,None,None,Trang City,4.1
T0117,2026-03-08,12:15,Sun,Mar,Lunch,C0121,34,Female,VIP,No,Butter Croissant,Bakery,1,55.00,55.00,8.25,46.75,33.41,13.34,28.5%,ShopeeFood,QR,Combo 15%,Member Exclusive,Trang City,4.6
T0118,2026-06-11,15:50,Thu,Jun,Afternoon,C0230,30,Female,VIP,Yes,French Fries,Snack,3,69.00,207.00,0.00,207.00,130.26,76.74,37.1%,ShopeeFood,QR,None,None,Trang City,3.7
T0119,2026-01-08,20:05,Thu,Jan,Evening,C0203,24,Other,New,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,35.70,29.30,45.1%,Grab,QR,None,None,Trang City,4.1
T0120,2026-04-12,11:45,Sun,Apr,Lunch,C0164,24,Female,Returning,Yes,Americano,Coffee,1,65.00,65.00,0.00,65.00,33.70,31.30,48.2%,Grab,QR,None,None,Huai Yot,4.4
T0121,2026-03-18,19:40,Wed,Mar,Evening,C0032,32,Male,Returning,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,37.60,32.40,46.3%,ShopeeFood,Card,None,None,Huai Yot,4.2
T0122,2026-01-06,18:20,Tue,Jan,Evening,C0129,20,Female,New,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,8.90,80.10,49.00,31.10,38.8%,LINE,QR,10% Discount,Student Deal,Kantang,4.1
T0123,2026-04-02,15:05,Thu,Apr,Afternoon,C0109,24,Female,Returning,Yes,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,28.50,41.50,59.3%,LINE,QR,None,None,Trang City,4.5
T0124,2026-02-27,21:10,Fri,Feb,Evening,C0354,21,Female,New,No,Peach Tea,Tea,1,70.00,70.00,7.00,63.00,36.34,26.66,42.3%,Grab,QR,10% Discount,Payday,Trang City,4.4
T0125,2026-04-07,19:10,Tue,Apr,Evening,C0297,19,Female,New,No,Peach Tea,Tea,1,70.00,70.00,31.50,38.50,51.93,-13.43,-34.9%,LINE,QR,Buy 1 Get 1,Student Deal,Huai Yot,4.4
T0126,2026-04-29,09:35,Wed,Apr,Morning,C0154,43,Male,VIP,Yes,Iced Latte,Coffee,2,75.00,150.00,22.50,127.50,78.95,48.55,38.1%,Grab,QR,Combo 15%,Member Exclusive,Trang City,4.2
T0127,2026-03-31,09:45,Tue,Mar,Morning,C0231,33,Male,New,No,Caramel Macchiato,Coffee,1,85.00,85.00,8.50,76.50,33.00,43.50,56.9%,Store,Cash,10% Discount,Payday,Huai Yot,4.6
T0128,2026-03-26,19:20,Thu,Mar,Evening,C0088,22,Female,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,8.90,80.10,59.42,20.68,25.8%,Grab,QR,10% Discount,Payday,Trang City,4.5
T0129,2026-03-02,12:25,Mon,Mar,Lunch,C0308,21,Male,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,Grab,Card,None,None,Trang City,4.3
T0130,2026-01-02,10:50,Fri,Jan,Morning,C0074,30,Female,Returning,Yes,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,36.25,48.75,57.4%,LINE,QR,None,None,Trang City,4.6
T0131,2026-06-25,12:35,Thu,Jun,Lunch,C0207,19,Female,Returning,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,61.02,27.98,31.4%,Grab,Card,None,None,Trang City,4.3
T0132,2026-03-20,13:40,Fri,Mar,Lunch,C0336,21,Other,Returning,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,49.45,39.55,44.4%,LINE,QR,None,None,Trang City,3.9
T0133,2026-06-13,20:15,Sat,Jun,Evening,C0174,23,Male,New,No,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,34.90,20.10,36.6%,Grab,Card,None,None,Trang City,4.5
T0134,2026-05-05,15:50,Tue,May,Afternoon,C0353,22,Male,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,35.70,29.30,45.1%,ShopeeFood,Card,None,None,Trang City,4.0
T0135,2026-06-13,17:05,Sat,Jun,Afternoon,C0154,21,Male,New,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,37.25,47.75,56.2%,LINE,QR,None,None,Kantang,4.1
T0136,2026-06-10,08:35,Wed,Jun,Morning,C0138,53,Female,Returning,Yes,Americano,Coffee,1,65.00,65.00,0.00,65.00,25.25,39.75,61.2%,LINE,Card,None,None,Huai Yot,3.7
T0137,2026-03-02,15:20,Mon,Mar,Afternoon,C0190,33,Male,New,No,Americano,Coffee,2,65.00,130.00,0.00,130.00,44.00,86.00,66.2%,Store,Card,None,None,Kantang,4.3
T0138,2026-03-11,15:25,Wed,Mar,Afternoon,C0061,32,Male,VIP,Yes,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,56.00,94.00,62.7%,Store,QR,None,None,Trang City,4.4
T0139,2026-04-25,20:05,Sat,Apr,Evening,C0348,21,Male,New,No,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,34.00,41.00,54.7%,Store,QR,None,None,Trang City,4.4
T0140,2026-02-11,18:50,Wed,Feb,Evening,C0067,23,Female,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,33.75,41.25,63.42,-22.17,-53.8%,Grab,QR,Buy 1 Get 1,Student Deal,Huai Yot,4.7
T0141,2026-03-29,12:55,Sun,Mar,Lunch,C0317,34,Female,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,11.25,63.75,28.00,35.75,56.1%,Store,QR,Combo 15%,Weekend Boost,Trang City,4.3
T0142,2026-01-22,20:30,Thu,Jan,Evening,C0144,20,Male,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,5.50,49.50,33.91,15.59,31.5%,Grab,QR,10% Discount,Student Deal,Trang City,4.7
T0143,2026-06-15,15:20,Mon,Jun,Afternoon,C0137,32,Male,VIP,No,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,63.50,86.50,57.7%,LINE,QR,None,None,Trang City,4.4
T0144,2026-03-12,21:30,Thu,Mar,Evening,C0230,20,Male,New,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,37.60,32.40,46.3%,Grab,Card,None,None,Trang City,4.2
T0145,2026-04-24,14:35,Fri,Apr,Afternoon,C0231,40,Female,Returning,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,Card,None,None,Trang City,4.7
T0146,2026-01-19,16:35,Mon,Jan,Afternoon,C0147,39,Female,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,25.00,30.00,54.6%,Store,QR,None,None,Trang City,4.8
T0147,2026-02-03,10:55,Tue,Feb,Morning,C0262,31,Female,New,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,Card,None,None,Trang City,3.6
T0148,2026-05-17,16:45,Sun,May,Afternoon,C0269,40,Female,New,No,Thai Tea,Tea,2,65.00,130.00,0.00,130.00,48.00,82.00,63.1%,Store,QR,None,None,Trang City,4.2
T0149,2026-03-13,20:05,Fri,Mar,Evening,C0017,19,Male,New,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,ShopeeFood,QR,None,None,Huai Yot,4.5
T0150,2026-01-31,20:10,Sat,Jan,Evening,C0054,18,Male,Returning,Yes,Ham Cheese Sandwich,Snack,2,89.00,178.00,0.00,178.00,122.04,55.96,31.4%,ShopeeFood,QR,None,None,Kantang,3.8
T0151,2026-05-22,20:30,Fri,May,Evening,C0059,20,Female,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,5.50,49.50,33.91,15.59,31.5%,Grab,QR,10% Discount,Student Deal,Huai Yot,4.5
T0152,2026-02-03,20:30,Tue,Feb,Evening,C0216,24,Female,New,No,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,83.00,67.00,44.7%,Grab,Cash,None,None,Trang City,3.7
T0153,2026-01-14,11:45,Wed,Jan,Lunch,C0187,27,Male,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,QR,None,None,Trang City,4.7
T0154,2026-05-27,12:00,Wed,May,Lunch,C0242,36,Female,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,8.90,80.10,59.42,20.68,25.8%,ShopeeFood,QR,10% Discount,Payday,Huai Yot,3.7
T0155,2026-02-07,19:55,Sat,Feb,Evening,C0131,18,Male,New,No,Chocolate Cake,Bakery,2,75.00,150.00,15.00,135.00,92.30,42.70,31.6%,Grab,Card,10% Discount,Student Deal,Huai Yot,4.1
T0156,2026-04-08,09:40,Wed,Apr,Morning,C0170,31,Male,New,No,French Fries,Snack,1,69.00,69.00,0.00,69.00,31.00,38.00,55.1%,Store,QR,None,None,Trang City,3.9
T0157,2026-05-25,14:55,Mon,May,Afternoon,C0190,21,Female,Returning,No,Americano,Coffee,3,65.00,195.00,0.00,195.00,66.00,129.00,66.2%,Store,QR,None,None,Huai Yot,3.8
T0158,2026-02-24,19:00,Tue,Feb,Evening,C0089,21,Female,Returning,Yes,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,47.50,27.50,36.7%,Grab,Cash,None,None,Trang City,4.2
T0159,2026-03-23,21:30,Mon,Mar,Evening,C0200,19,Female,Returning,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,36.25,48.75,57.4%,LINE,QR,None,None,Kantang,4.1
T0160,2026-02-07,16:20,Sat,Feb,Afternoon,C0092,23,Male,Returning,Yes,Matcha Latte,Tea,2,85.00,170.00,0.00,170.00,94.60,75.40,44.4%,ShopeeFood,QR,None,None,Huai Yot,3.8
T0161,2026-02-26,08:15,Thu,Feb,Morning,C0083,28,Female,Returning,No,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,56.00,94.00,62.7%,Store,QR,None,None,Huai Yot,4.1
T0162,2026-03-28,17:30,Sat,Mar,Afternoon,C0010,33,Female,Returning,No,Matcha Latte,Tea,2,85.00,170.00,0.00,170.00,64.00,106.00,62.4%,Store,QR,None,None,Trang City,4.8
T0163,2026-05-27,13:35,Wed,May,Lunch,C0169,22,Female,New,No,Ham Cheese Sandwich,Snack,2,89.00,178.00,0.00,178.00,90.00,88.00,49.4%,Store,QR,None,None,Trang City,3.6
T0164,2026-01-17,13:25,Sat,Jan,Lunch,C0050,28,Female,New,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,Cash,None,None,Trang City,4.4
T0165,2026-03-14,10:10,Sat,Mar,Morning,C0163,55,Male,Returning,No,French Fries,Snack,1,69.00,69.00,0.00,69.00,43.42,25.58,37.1%,ShopeeFood,QR,None,None,Kantang,4.3
T0166,2026-03-31,16:25,Tue,Mar,Afternoon,C0316,22,Female,New,No,Peach Tea,Tea,1,70.00,70.00,7.00,63.00,36.34,26.66,42.3%,Grab,QR,10% Discount,Payday,Huai Yot,4.3
T0167,2026-05-04,13:45,Mon,May,Lunch,C0074,21,Male,VIP,No,Peach Tea,Tea,2,70.00,140.00,0.00,140.00,50.00,90.00,64.3%,Store,QR,None,None,Trang City,4.2
T0168,2026-01-03,11:50,Sat,Jan,Lunch,C0289,30,Female,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,8.25,46.75,27.34,19.41,41.5%,LINE,QR,Combo 15%,Weekend Boost,Trang City,4.2
T0169,2026-02-07,12:15,Sat,Feb,Lunch,C0124,23,Male,New,No,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,83.00,67.00,44.7%,Grab,QR,None,None,Trang City,4.3
T0170,2026-05-26,10:50,Tue,May,Morning,C0290,21,Female,Returning,No,Chocolate Cake,Bakery,1,75.00,75.00,7.50,67.50,34.00,33.50,49.6%,Store,QR,10% Discount,Payday,Kantang,4.7
T0171,2026-04-05,15:50,Sun,Apr,Afternoon,C0313,30,Male,VIP,No,French Fries,Snack,1,69.00,69.00,10.35,58.65,31.00,27.65,47.1%,Store,QR,Combo 15%,Weekend Boost,Trang City,4.1
T0172,2026-03-09,09:15,Mon,Mar,Morning,C0218,23,Female,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,31.75,43.25,57.7%,LINE,Card,None,None,Trang City,4.5
T0173,2026-01-20,11:45,Tue,Jan,Lunch,C0024,36,Male,Returning,No,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,34.90,20.10,36.6%,Grab,QR,None,None,Trang City,3.2
T0174,2026-01-14,18:35,Wed,Jan,Evening,C0348,20,Male,Returning,Yes,Caramel Macchiato,Coffee,2,85.00,170.00,0.00,170.00,96.60,73.40,43.2%,Grab,Cash,None,None,Trang City,4.0
T0175,2026-05-31,18:55,Sun,May,Evening,C0279,21,Female,VIP,No,Americano,Coffee,1,65.00,65.00,9.75,55.25,31.95,23.30,42.2%,Grab,Cash,Combo 15%,Member Exclusive,Kantang,4.3
T0176,2026-01-04,18:30,Sun,Jan,Evening,C0235,19,Female,Returning,No,French Fries,Snack,1,69.00,69.00,31.05,37.95,68.83,-30.88,-81.4%,ShopeeFood,QR,Buy 1 Get 1,Student Deal,Trang City,3.8
T0177,2026-03-29,21:50,Sun,Mar,Evening,C0239,20,Male,New,No,Chocolate Cake,Bakery,1,75.00,75.00,33.75,41.25,75.42,-34.17,-82.8%,Grab,QR,Buy 1 Get 1,Student Deal,Kantang,4.6
T0178,2026-04-21,10:10,Tue,Apr,Morning,C0035,31,Female,VIP,Yes,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,33.00,52.00,61.2%,Store,QR,None,None,Trang City,4.6
T0179,2026-04-13,10:25,Mon,Apr,Morning,C0101,32,Male,Returning,No,Iced Latte,Coffee,3,75.00,225.00,0.00,225.00,124.50,100.50,44.7%,ShopeeFood,Card,None,None,Huai Yot,4.1
T0180,2026-06-09,09:05,Tue,Jun,Morning,C0341,28,Female,New,No,Peach Tea,Tea,2,70.00,140.00,0.00,140.00,75.20,64.80,46.3%,ShopeeFood,Cash,None,None,Kantang,4.6
T0181,2026-05-19,14:15,Tue,May,Afternoon,C0208,18,Male,Returning,Yes,Chocolate Cake,Bakery,2,75.00,150.00,0.00,150.00,95.00,55.00,36.7%,ShopeeFood,Card,None,None,Trang City,4.5
T0182,2026-05-01,12:40,Fri,May,Lunch,C0202,29,Female,VIP,Yes,Thai Tea,Tea,2,65.00,130.00,19.50,110.50,67.89,42.61,38.6%,ShopeeFood,Card,Combo 15%,Member Exclusive,Trang City,3.8
T0183,2026-02-22,15:20,Sun,Feb,Afternoon,C0187,28,Male,VIP,Yes,Peach Tea,Tea,1,70.00,70.00,10.50,59.50,25.00,34.50,58.0%,Store,QR,Combo 15%,Member Exclusive,Huai Yot,4.4
T0184,2026-04-16,12:00,Thu,Apr,Lunch,C0326,29,Male,Returning,Yes,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,34.00,41.00,54.7%,Store,QR,None,None,Trang City,4.3
T0185,2026-05-28,11:15,Thu,May,Lunch,C0360,18,Male,Returning,Yes,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,37.60,32.40,46.3%,Grab,QR,None,None,Trang City,3.7
T0186,2026-04-18,14:50,Sat,Apr,Afternoon,C0334,23,Male,New,No,Matcha Latte,Tea,2,85.00,170.00,0.00,170.00,94.60,75.40,44.4%,ShopeeFood,QR,None,None,Trang City,4.1
T0187,2026-02-13,11:10,Fri,Feb,Lunch,C0247,32,Male,Returning,No,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,25.00,30.00,54.6%,Store,QR,None,None,Kantang,3.8
T0188,2026-01-01,17:25,Thu,Jan,Afternoon,C0101,26,Male,Returning,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,QR,None,None,Kantang,4.1
T0189,2026-06-15,20:15,Mon,Jun,Evening,C0019,22,Female,Returning,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,Grab,Cash,None,None,Trang City,4.8
T0190,2026-04-04,17:00,Sat,Apr,Afternoon,C0245,29,Male,Returning,Yes,Matcha Latte,Tea,3,85.00,255.00,0.00,255.00,141.90,113.10,44.4%,Grab,QR,None,None,Kantang,4.8
T0191,2026-03-06,10:40,Fri,Mar,Morning,C0008,33,Male,Returning,Yes,Caramel Macchiato,Coffee,2,85.00,170.00,0.00,170.00,66.00,104.00,61.2%,Store,Cash,None,None,Trang City,4.2
T0192,2026-05-08,21:45,Fri,May,Evening,C0118,36,Female,Returning,Yes,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,33.00,52.00,61.2%,Store,QR,None,None,Trang City,4.4
T0193,2026-01-13,18:40,Tue,Jan,Evening,C0341,35,Female,VIP,No,French Fries,Snack,2,69.00,138.00,0.00,138.00,86.84,51.16,37.1%,Grab,Card,None,None,Huai Yot,4.3
T0194,2026-03-29,11:20,Sun,Mar,Lunch,C0084,44,Male,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,24.00,41.00,63.1%,Store,QR,None,None,Trang City,4.6
T0195,2026-04-01,16:30,Wed,Apr,Afternoon,C0002,48,Female,VIP,Yes,Chocolate Cake,Bakery,2,75.00,150.00,22.50,127.50,68.00,59.50,46.7%,Store,QR,Combo 15%,Member Exclusive,Trang City,4.0
T0196,2026-03-08,10:05,Sun,Mar,Morning,C0271,41,Female,New,No,Caramel Macchiato,Coffee,2,85.00,170.00,0.00,170.00,66.00,104.00,61.2%,Store,QR,None,None,Trang City,4.5
T0197,2026-05-15,12:00,Fri,May,Lunch,C0088,18,Male,New,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,27.25,37.75,58.1%,LINE,QR,None,None,Kantang,3.8
T0198,2026-03-16,21:05,Mon,Mar,Evening,C0077,22,Male,Returning,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,33.00,52.00,61.2%,Store,Cash,None,None,Trang City,3.9
T0199,2026-03-20,16:25,Fri,Mar,Afternoon,C0199,19,Other,New,No,Caramel Macchiato,Coffee,3,85.00,255.00,0.00,255.00,99.00,156.00,61.2%,Store,QR,None,None,Trang City,4.6
T0200,2026-02-24,13:40,Tue,Feb,Lunch,C0071,28,Male,New,No,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,27.75,27.25,49.6%,LINE,QR,None,None,Kantang,4.9
T0201,2026-05-28,14:25,Thu,May,Afternoon,C0309,33,Female,Returning,No,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,34.00,41.00,54.7%,Store,QR,None,None,Trang City,4.4
T0202,2026-04-25,21:50,Sat,Apr,Evening,C0356,24,Female,VIP,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,48.30,36.70,43.2%,Grab,QR,None,None,Trang City,4.4
T0203,2026-02-23,16:00,Mon,Feb,Afternoon,C0025,26,Other,Returning,Yes,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,25.00,45.00,64.3%,Store,QR,None,None,Trang City,4.6
T0204,2026-05-31,12:25,Sun,May,Lunch,C0092,52,Female,VIP,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,13.35,75.65,58.62,17.03,22.5%,Grab,QR,Combo 15%,Member Exclusive,Trang City,4.3
T0205,2026-05-02,18:50,Sat,May,Evening,C0300,19,Female,Returning,Yes,Caramel Macchiato,Coffee,2,85.00,170.00,34.00,136.00,123.48,12.52,9.2%,ShopeeFood,QR,Buy 1 Get 1,Student Deal,Huai Yot,4.1
T0206,2026-05-26,16:05,Tue,May,Afternoon,C0074,52,Male,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,49.45,39.55,44.4%,LINE,Card,None,None,Trang City,4.0
T0207,2026-01-13,10:00,Tue,Jan,Morning,C0057,45,Female,Returning,Yes,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,48.30,36.70,43.2%,ShopeeFood,QR,None,None,Kantang,3.6
T0208,2026-06-29,10:25,Mon,Jun,Morning,C0333,30,Male,New,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,22.00,43.00,66.2%,Store,Card,None,None,Trang City,4.1
T0209,2026-03-28,18:40,Sat,Mar,Evening,C0277,19,Female,Returning,No,Americano,Coffee,1,65.00,65.00,9.75,55.25,31.95,23.30,42.2%,Grab,QR,Combo 15%,Weekend Boost,Trang City,4.2
T0210,2026-04-05,11:55,Sun,Apr,Lunch,C0087,27,Male,New,No,Chocolate Cake,Bakery,1,75.00,75.00,11.25,63.75,34.00,29.75,46.7%,Store,QR,Combo 15%,Weekend Boost,Trang City,3.8
T0211,2026-03-16,15:00,Mon,Mar,Afternoon,C0077,40,Female,Returning,No,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,27.75,27.25,49.6%,LINE,QR,None,None,Trang City,4.6
T0212,2026-04-26,08:20,Sun,Apr,Morning,C0071,40,Male,Returning,Yes,Butter Croissant,Bakery,2,55.00,110.00,11.00,99.00,54.95,44.05,44.5%,LINE,Card,10% Discount,Payday,Trang City,4.3
T0213,2026-02-27,14:20,Fri,Feb,Afternoon,C0124,47,Male,Returning,No,Matcha Latte,Tea,1,85.00,85.00,8.50,76.50,32.00,44.50,58.2%,Store,Card,10% Discount,Payday,Trang City,4.0
T0214,2026-02-10,08:10,Tue,Feb,Morning,C0154,20,Male,New,No,French Fries,Snack,1,69.00,69.00,0.00,69.00,31.00,38.00,55.1%,Store,Cash,None,None,Kantang,4.6
T0215,2026-06-10,18:10,Wed,Jun,Evening,C0251,24,Female,VIP,No,Ham Cheese Sandwich,Snack,2,89.00,178.00,17.80,160.20,118.84,41.36,25.8%,Grab,QR,10% Discount,Student Deal,Trang City,3.7
T0216,2026-04-11,21:30,Sat,Apr,Evening,C0118,20,Female,VIP,No,Americano,Coffee,1,65.00,65.00,9.75,55.25,31.95,23.30,42.2%,Grab,Card,Combo 15%,Weekend Boost,Huai Yot,4.8
T0217,2026-03-12,20:15,Thu,Mar,Evening,C0317,31,Male,New,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,45.00,44.00,49.4%,Store,Card,None,None,Trang City,4.9
T0218,2026-05-06,14:30,Wed,May,Afternoon,C0265,53,Male,New,No,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,63.50,86.50,57.7%,LINE,QR,None,None,Trang City,4.5
T0219,2026-02-22,21:05,Sun,Feb,Evening,C0135,18,Male,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,61.02,27.98,31.4%,Grab,Cash,None,None,Trang City,4.5
T0220,2026-05-05,14:55,Tue,May,Afternoon,C0109,29,Female,Returning,Yes,Americano,Coffee,1,65.00,65.00,0.00,65.00,25.25,39.75,61.2%,LINE,QR,None,None,Trang City,3.8
T0221,2026-06-21,20:55,Sun,Jun,Evening,C0196,24,Female,New,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,49.45,39.55,44.4%,LINE,QR,None,None,Huai Yot,4.5
T0222,2026-02-02,13:10,Mon,Feb,Lunch,C0214,42,Female,VIP,No,Iced Latte,Coffee,1,75.00,75.00,11.25,63.75,28.00,35.75,56.1%,Store,QR,Combo 15%,Member Exclusive,Trang City,3.9
T0223,2026-03-27,21:50,Fri,Mar,Evening,C0211,22,Female,Returning,Yes,Caramel Macchiato,Coffee,1,85.00,85.00,38.25,46.75,68.34,-21.59,-46.2%,LINE,QR,Buy 1 Get 1,Student Deal,Trang City,3.8
T0224,2026-03-15,18:25,Sun,Mar,Evening,C0147,21,Male,New,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,40.05,48.95,98.81,-49.86,-101.9%,ShopeeFood,Cash,Buy 1 Get 1,Student Deal,Trang City,3.7
T0225,2026-05-19,17:40,Tue,May,Afternoon,C0041,19,Female,Returning,Yes,Thai Tea,Tea,2,65.00,130.00,0.00,130.00,54.50,75.50,58.1%,LINE,QR,None,None,Huai Yot,4.1
T0226,2026-05-16,19:45,Sat,May,Evening,C0291,47,Female,Returning,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,32.00,53.00,62.4%,Store,QR,None,None,Trang City,3.6
T0227,2026-02-18,20:30,Wed,Feb,Evening,C0324,18,Female,Returning,Yes,Americano,Coffee,1,65.00,65.00,0.00,65.00,33.70,31.30,48.2%,Grab,QR,None,None,Trang City,4.0
T0228,2026-03-26,20:45,Thu,Mar,Evening,C0069,24,Female,Returning,Yes,Caramel Macchiato,Coffee,3,85.00,255.00,34.00,221.00,171.78,49.22,22.3%,Grab,Card,Buy 1 Get 1,Student Deal,Trang City,4.1
T0229,2026-04-14,18:10,Tue,Apr,Evening,C0059,24,Male,VIP,Yes,French Fries,Snack,2,69.00,138.00,20.70,117.30,67.87,49.43,42.1%,LINE,QR,Combo 15%,Member Exclusive,Trang City,3.9
T0230,2026-04-27,11:55,Mon,Apr,Lunch,C0057,42,Female,Returning,Yes,French Fries,Snack,2,69.00,138.00,0.00,138.00,86.84,51.16,37.1%,ShopeeFood,QR,None,None,Trang City,3.9
T0231,2026-02-21,09:00,Sat,Feb,Morning,C0106,30,Male,VIP,No,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,25.00,30.00,54.6%,Store,QR,None,None,Kantang,4.3
T0232,2026-06-27,19:10,Sat,Jun,Evening,C0077,23,Male,Returning,Yes,Butter Croissant,Bakery,2,55.00,110.00,0.00,110.00,55.50,54.50,49.6%,LINE,QR,None,None,Kantang,4.5
T0233,2026-02-14,14:55,Sat,Feb,Afternoon,C0332,36,Female,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,27.75,27.25,49.6%,LINE,QR,None,None,Trang City,4.3
T0234,2026-06-22,14:30,Mon,Jun,Afternoon,C0115,41,Male,New,No,French Fries,Snack,1,69.00,69.00,0.00,69.00,31.00,38.00,55.1%,Store,Card,None,None,Trang City,4.7
T0235,2026-01-09,21:20,Fri,Jan,Evening,C0041,23,Male,New,No,Matcha Latte,Tea,1,85.00,85.00,8.50,76.50,45.77,30.73,40.2%,Grab,Card,10% Discount,Student Deal,Trang City,4.3
T0236,2026-01-19,21:15,Mon,Jan,Evening,C0066,19,Female,Returning,Yes,French Fries,Snack,1,69.00,69.00,6.90,62.10,42.18,19.92,32.1%,Grab,QR,10% Discount,Student Deal,Trang City,4.0
T0237,2026-01-24,21:45,Sat,Jan,Evening,C0274,24,Male,Returning,Yes,Ham Cheese Sandwich,Snack,2,89.00,178.00,0.00,178.00,122.04,55.96,31.4%,Grab,QR,None,None,Trang City,4.0
T0238,2026-02-08,13:45,Sun,Feb,Lunch,C0209,34,Female,Returning,Yes,Peach Tea,Tea,2,70.00,140.00,0.00,140.00,75.20,64.80,46.3%,Grab,Card,None,None,Trang City,3.9
T0239,2026-03-02,19:20,Mon,Mar,Evening,C0299,18,Male,Returning,Yes,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,Grab,QR,None,None,Huai Yot,4.1
T0240,2026-04-08,11:05,Wed,Apr,Lunch,C0234,41,Male,New,No,French Fries,Snack,3,69.00,207.00,0.00,207.00,93.00,114.00,55.1%,Store,QR,None,None,Kantang,3.9
T0241,2026-05-02,18:10,Sat,May,Evening,C0327,21,Male,Returning,No,Matcha Latte,Tea,1,85.00,85.00,12.75,72.25,45.00,27.25,37.7%,Grab,QR,Combo 15%,Weekend Boost,Trang City,4.0
T0242,2026-03-14,12:20,Sat,Mar,Lunch,C0295,34,Female,New,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,37.60,32.40,46.3%,Grab,QR,None,None,Trang City,3.8
T0243,2026-02-19,13:10,Thu,Feb,Lunch,C0092,30,Other,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,QR,None,None,Trang City,4.4
T0244,2026-02-02,13:35,Mon,Feb,Lunch,C0133,53,Female,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,25.00,30.00,54.6%,Store,QR,None,None,Trang City,3.6
T0245,2026-05-02,17:20,Sat,May,Afternoon,C0154,30,Female,Returning,Yes,French Fries,Snack,1,69.00,69.00,0.00,69.00,31.00,38.00,55.1%,Store,QR,None,None,Kantang,4.3
T0246,2026-05-03,15:45,Sun,May,Afternoon,C0225,37,Female,Returning,Yes,Americano,Coffee,1,65.00,65.00,0.00,65.00,22.00,43.00,66.2%,Store,QR,None,None,Trang City,4.5
T0247,2026-01-10,15:20,Sat,Jan,Afternoon,C0089,39,Female,Returning,Yes,Americano,Coffee,1,65.00,65.00,0.00,65.00,25.25,39.75,61.2%,LINE,QR,None,None,Huai Yot,4.5
T0248,2026-05-14,21:30,Thu,May,Evening,C0261,18,Male,Returning,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,37.60,32.40,46.3%,Grab,QR,None,None,Trang City,4.4
T0249,2026-05-30,12:30,Sat,May,Lunch,C0089,23,Male,Returning,Yes,Matcha Latte,Tea,1,85.00,85.00,12.75,72.25,35.61,36.64,50.7%,LINE,QR,Combo 15%,Weekend Boost,Trang City,4.2
T0250,2026-03-25,13:25,Wed,Mar,Lunch,C0314,40,Female,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,24.00,41.00,63.1%,Store,QR,None,None,Trang City,4.5
T0251,2026-03-08,14:45,Sun,Mar,Afternoon,C0152,43,Male,VIP,Yes,Americano,Coffee,1,65.00,65.00,9.75,55.25,22.00,33.25,60.2%,Store,Card,Combo 15%,Weekend Boost,Trang City,3.9
T0252,2026-04-24,18:15,Fri,Apr,Evening,C0170,30,Male,New,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,ShopeeFood,Card,None,None,Kantang,3.7
T0253,2026-01-10,17:50,Sat,Jan,Afternoon,C0095,22,Male,New,No,Iced Latte,Coffee,2,75.00,150.00,22.50,127.50,56.00,71.50,56.1%,Store,Card,Combo 15%,Weekend Boost,Trang City,4.2
T0254,2026-01-05,14:30,Mon,Jan,Afternoon,C0134,28,Female,Returning,Yes,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,48.30,36.70,43.2%,ShopeeFood,QR,None,None,Huai Yot,4.2
T0255,2026-01-17,17:45,Sat,Jan,Afternoon,C0235,20,Male,New,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,35.70,29.30,45.1%,Grab,Card,None,None,Trang City,4.1
T0256,2026-04-26,14:15,Sun,Apr,Afternoon,C0270,29,Female,New,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,32.00,53.00,62.4%,Store,QR,None,None,Huai Yot,3.7
T0257,2026-04-12,09:25,Sun,Apr,Morning,C0189,23,Female,Returning,Yes,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,28.50,41.50,59.3%,LINE,QR,None,None,Trang City,4.1
T0258,2026-05-05,16:55,Tue,May,Afternoon,C0310,24,Female,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,49.45,39.55,44.4%,LINE,QR,None,None,Huai Yot,4.2
T0259,2026-03-12,10:20,Thu,Mar,Morning,C0280,51,Female,Returning,Yes,Thai Tea,Tea,3,65.00,195.00,0.00,195.00,107.10,87.90,45.1%,Grab,Card,None,None,Trang City,4.9
T0260,2026-04-24,15:50,Fri,Apr,Afternoon,C0151,31,Female,Returning,Yes,Caramel Macchiato,Coffee,2,85.00,170.00,0.00,170.00,96.60,73.40,43.2%,ShopeeFood,QR,None,None,Trang City,4.4
T0261,2026-06-15,20:05,Mon,Jun,Evening,C0173,24,Female,Returning,Yes,Caramel Macchiato,Coffee,1,85.00,85.00,8.50,76.50,33.00,43.50,56.9%,Store,QR,10% Discount,Student Deal,Trang City,4.0
T0262,2026-04-21,19:55,Tue,Apr,Evening,C0200,21,Male,Returning,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,25.25,39.75,61.2%,LINE,Card,None,None,Trang City,4.6
T0263,2026-03-17,14:55,Tue,Mar,Afternoon,C0175,20,Female,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,Grab,Card,None,None,Trang City,4.4
T0264,2026-02-22,10:15,Sun,Feb,Morning,C0037,40,Female,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,61.02,27.98,31.4%,ShopeeFood,QR,None,None,Trang City,3.7
T0265,2026-04-07,20:25,Tue,Apr,Evening,C0204,18,Male,New,No,Matcha Latte,Tea,2,85.00,170.00,0.00,170.00,94.60,75.40,44.4%,Grab,QR,None,None,Kantang,4.3
T0266,2026-05-19,18:55,Tue,May,Evening,C0212,18,Male,Returning,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,48.30,36.70,43.2%,Grab,QR,None,None,Kantang,4.2
T0267,2026-04-20,18:50,Mon,Apr,Evening,C0160,23,Female,New,No,Butter Croissant,Bakery,1,55.00,55.00,24.75,30.25,55.44,-25.19,-83.3%,Grab,QR,Buy 1 Get 1,Student Deal,Trang City,3.9
T0268,2026-03-21,17:30,Sat,Mar,Afternoon,C0170,21,Female,Returning,Yes,Ham Cheese Sandwich,Snack,3,89.00,267.00,0.00,267.00,183.06,83.94,31.4%,Grab,Cash,None,None,Trang City,4.1
T0269,2026-04-30,16:00,Thu,Apr,Afternoon,C0169,18,Female,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,34.90,20.10,36.6%,ShopeeFood,QR,None,None,Trang City,4.3
T0270,2026-02-06,08:20,Fri,Feb,Morning,C0140,21,Other,Returning,Yes,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,Grab,Card,None,None,Trang City,3.7
T0271,2026-04-26,21:25,Sun,Apr,Evening,C0125,19,Male,New,No,Butter Croissant,Bakery,1,55.00,55.00,24.75,30.25,50.00,-19.75,-65.3%,Store,QR,Buy 1 Get 1,Student Deal,Trang City,4.3
T0272,2026-04-26,17:25,Sun,Apr,Afternoon,C0167,30,Female,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,25.00,30.00,54.6%,Store,Card,None,None,Trang City,4.5
T0273,2026-01-09,18:55,Fri,Jan,Evening,C0273,23,Male,New,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,37.25,47.75,56.2%,LINE,QR,None,None,Huai Yot,4.6
T0274,2026-02-14,19:45,Sat,Feb,Evening,C0075,25,Female,VIP,Yes,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,34.90,20.10,36.6%,ShopeeFood,QR,None,None,Kantang,3.9
T0275,2026-04-23,08:30,Thu,Apr,Morning,C0343,24,Male,New,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,32.00,53.00,62.4%,Store,QR,None,None,Kantang,4.6
T0276,2026-05-02,11:05,Sat,May,Lunch,C0232,25,Male,New,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,61.02,27.98,31.4%,Grab,QR,None,None,Trang City,4.0
T0277,2026-02-02,13:45,Mon,Feb,Lunch,C0005,40,Female,New,No,French Fries,Snack,1,69.00,69.00,0.00,69.00,31.00,38.00,55.1%,Store,QR,None,None,Huai Yot,4.0
T0278,2026-03-28,12:20,Sat,Mar,Lunch,C0293,25,Male,New,No,Iced Latte,Coffee,1,75.00,75.00,7.50,67.50,28.00,39.50,58.5%,Store,QR,10% Discount,Payday,Trang City,3.8
T0279,2026-05-14,16:45,Thu,May,Afternoon,C0353,22,Female,Returning,Yes,Thai Tea,Tea,3,65.00,195.00,0.00,195.00,107.10,87.90,45.1%,ShopeeFood,Card,None,None,Trang City,4.1
T0280,2026-05-09,21:40,Sat,May,Evening,C0013,19,Other,Returning,Yes,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,47.50,27.50,36.7%,Grab,QR,None,None,Trang City,4.4
T0281,2026-05-02,13:45,Sat,May,Lunch,C0173,22,Male,Returning,Yes,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,25.00,45.00,64.3%,Store,QR,None,None,Huai Yot,4.7
T0282,2026-04-21,21:55,Tue,Apr,Evening,C0104,22,Male,Returning,Yes,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,36.25,48.75,57.4%,LINE,QR,None,None,Trang City,3.6
T0283,2026-05-24,20:35,Sun,May,Evening,C0208,24,Female,New,No,Americano,Coffee,1,65.00,65.00,6.50,58.50,32.53,25.97,44.4%,Grab,QR,10% Discount,Student Deal,Kantang,4.2
T0284,2026-04-23,20:45,Thu,Apr,Evening,C0031,23,Male,Returning,Yes,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,37.60,32.40,46.3%,Grab,Cash,None,None,Trang City,4.4
T0285,2026-04-14,09:05,Tue,Apr,Morning,C0323,19,Male,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,45.00,44.00,49.4%,Store,QR,None,None,Huai Yot,4.9
T0286,2026-06-02,16:35,Tue,Jun,Afternoon,C0294,20,Female,Returning,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,32.00,53.00,62.4%,Store,Card,None,None,Trang City,4.4
T0287,2026-02-28,12:35,Sat,Feb,Lunch,C0084,22,Male,Returning,Yes,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,83.00,67.00,44.7%,Grab,QR,None,None,Huai Yot,4.3
T0288,2026-03-05,19:00,Thu,Mar,Evening,C0164,19,Female,New,No,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,83.00,67.00,44.7%,Grab,QR,None,None,Trang City,4.2
T0289,2026-04-05,15:20,Sun,Apr,Afternoon,C0180,44,Female,Returning,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,45.00,44.00,49.4%,Store,Card,None,None,Trang City,3.8
T0290,2026-05-06,15:30,Wed,May,Afternoon,C0200,43,Male,Returning,Yes,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,48.30,36.70,43.2%,ShopeeFood,QR,None,None,Trang City,3.9
T0291,2026-01-05,20:40,Mon,Jan,Evening,C0189,22,Female,Returning,No,Matcha Latte,Tea,2,85.00,170.00,0.00,170.00,94.60,75.40,44.4%,Grab,QR,None,None,Trang City,4.0
T0292,2026-03-14,19:20,Sat,Mar,Evening,C0136,37,Male,VIP,No,Thai Tea,Tea,1,65.00,65.00,9.75,55.25,33.95,21.30,38.6%,Grab,QR,Combo 15%,Weekend Boost,Huai Yot,5.0
T0293,2026-03-28,19:25,Sat,Mar,Evening,C0171,30,Male,Returning,Yes,French Fries,Snack,1,69.00,69.00,6.90,62.10,34.11,27.99,45.1%,LINE,QR,10% Discount,Payday,Trang City,3.8
T0294,2026-02-01,11:15,Sun,Feb,Lunch,C0246,50,Female,Returning,Yes,French Fries,Snack,1,69.00,69.00,0.00,69.00,43.42,25.58,37.1%,Grab,QR,None,None,Trang City,4.0
T0295,2026-03-25,15:10,Wed,Mar,Afternoon,C0136,33,Male,New,No,Americano,Coffee,2,65.00,130.00,13.00,117.00,44.00,73.00,62.4%,Store,Cash,10% Discount,Payday,Kantang,4.7
T0296,2026-03-09,12:35,Mon,Mar,Lunch,C0063,27,Female,Returning,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,36.25,48.75,57.4%,LINE,Card,None,None,Huai Yot,3.9
T0297,2026-02-02,13:15,Mon,Feb,Lunch,C0256,27,Male,VIP,Yes,Peach Tea,Tea,2,70.00,140.00,0.00,140.00,75.20,64.80,46.3%,ShopeeFood,QR,None,None,Trang City,3.7
T0298,2026-03-13,15:35,Fri,Mar,Afternoon,C0056,28,Female,New,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,Card,None,None,Trang City,4.4
T0299,2026-01-22,18:35,Thu,Jan,Evening,C0072,29,Female,New,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,45.00,44.00,49.4%,Store,Card,None,None,Trang City,4.2
T0300,2026-06-25,13:00,Thu,Jun,Lunch,C0016,31,Female,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,34.90,20.10,36.6%,Grab,QR,None,None,Huai Yot,4.3
T0301,2026-03-19,09:15,Thu,Mar,Morning,C0305,38,Female,Returning,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,45.00,44.00,49.4%,Store,QR,None,None,Trang City,3.8
T0302,2026-02-03,11:50,Tue,Feb,Lunch,C0317,24,Female,New,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,ShopeeFood,QR,None,None,Kantang,4.1
T0303,2026-05-07,19:55,Thu,May,Evening,C0316,31,Male,Returning,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,QR,None,None,Trang City,4.4
T0304,2026-03-26,20:55,Thu,Mar,Evening,C0312,18,Female,New,No,Thai Tea,Tea,1,65.00,65.00,29.25,35.75,54.43,-18.68,-52.3%,Grab,QR,Buy 1 Get 1,Student Deal,Trang City,4.9
T0305,2026-03-03,21:55,Tue,Mar,Evening,C0214,20,Female,Returning,No,French Fries,Snack,2,69.00,138.00,0.00,138.00,68.90,69.10,50.1%,LINE,Card,None,None,Kantang,4.6
T0306,2026-02-20,15:45,Fri,Feb,Afternoon,C0227,32,Female,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,45.00,44.00,49.4%,Store,QR,None,None,Huai Yot,4.4
T0307,2026-03-13,12:50,Fri,Mar,Lunch,C0197,24,Male,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,31.75,43.25,57.7%,LINE,QR,None,None,Trang City,4.1
T0308,2026-03-16,15:55,Mon,Mar,Afternoon,C0246,20,Female,Returning,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,QR,None,None,Kantang,4.0
T0309,2026-06-16,17:30,Tue,Jun,Afternoon,C0107,50,Female,New,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,QR,None,None,Trang City,4.7
T0310,2026-06-04,18:40,Thu,Jun,Evening,C0135,22,Female,Returning,Yes,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,83.00,67.00,44.7%,ShopeeFood,Card,None,None,Trang City,4.0
T0311,2026-06-11,18:00,Thu,Jun,Evening,C0341,21,Female,New,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,48.30,36.70,43.2%,Grab,Card,None,None,Huai Yot,3.6
T0312,2026-02-09,16:50,Mon,Feb,Afternoon,C0274,21,Female,Returning,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,ShopeeFood,QR,None,None,Trang City,3.7
T0313,2026-06-11,14:30,Thu,Jun,Afternoon,C0214,29,Male,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,ShopeeFood,QR,None,None,Trang City,4.2
T0314,2026-01-22,16:00,Thu,Jan,Afternoon,C0352,23,Male,Returning,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,28.50,41.50,59.3%,LINE,Cash,None,None,Trang City,4.2
T0315,2026-05-17,17:50,Sun,May,Afternoon,C0184,28,Male,Returning,No,Americano,Coffee,3,65.00,195.00,29.25,165.75,74.29,91.46,55.2%,LINE,Card,Combo 15%,Weekend Boost,Trang City,4.6
T0316,2026-03-18,11:35,Wed,Mar,Lunch,C0308,47,Male,Returning,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,61.02,27.98,31.4%,Grab,QR,None,None,Trang City,4.7
T0317,2026-05-06,19:00,Wed,May,Evening,C0094,22,Male,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,34.90,20.10,36.6%,Grab,Card,None,None,Kantang,4.2
T0318,2026-03-03,20:10,Tue,Mar,Evening,C0050,18,Female,Returning,Yes,Butter Croissant,Bakery,2,55.00,110.00,0.00,110.00,50.00,60.00,54.6%,Store,Cash,None,None,Trang City,3.9
T0319,2026-06-02,09:50,Tue,Jun,Morning,C0212,27,Male,New,No,Matcha Latte,Tea,3,85.00,255.00,0.00,255.00,141.90,113.10,44.4%,Grab,QR,None,None,Trang City,4.7
T0320,2026-05-07,21:35,Thu,May,Evening,C0335,24,Male,Returning,No,Iced Latte,Coffee,2,75.00,150.00,30.00,120.00,105.60,14.40,12.0%,Grab,QR,Buy 1 Get 1,Student Deal,Kantang,4.6
T0321,2026-01-25,21:20,Sun,Jan,Evening,C0321,22,Female,Returning,No,Iced Latte,Coffee,1,75.00,75.00,7.50,67.50,31.38,36.12,53.5%,LINE,QR,10% Discount,Payday,Trang City,4.3
T0322,2026-06-11,15:40,Thu,Jun,Afternoon,C0260,20,Male,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,34.90,20.10,36.6%,Grab,QR,None,None,Trang City,4.2
T0323,2026-01-02,17:00,Fri,Jan,Afternoon,C0334,19,Female,New,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,32.00,53.00,62.4%,Store,QR,None,None,Trang City,3.9
T0324,2026-01-07,21:10,Wed,Jan,Evening,C0340,20,Male,VIP,No,Peach Tea,Tea,1,70.00,70.00,7.00,63.00,36.34,26.66,42.3%,Grab,Card,10% Discount,Student Deal,Trang City,4.5
T0325,2026-06-25,13:05,Thu,Jun,Lunch,C0323,28,Male,VIP,Yes,Butter Croissant,Bakery,3,55.00,165.00,24.75,140.25,100.24,40.01,28.5%,Grab,Card,Combo 15%,Member Exclusive,Trang City,4.2
T0326,2026-06-26,15:20,Fri,Jun,Afternoon,C0229,20,Female,Returning,No,Thai Tea,Tea,1,65.00,65.00,6.50,58.50,34.53,23.97,41.0%,Grab,Card,10% Discount,Payday,Kantang,4.7
T0327,2026-02-13,09:20,Fri,Feb,Morning,C0317,37,Male,New,No,Chocolate Cake,Bakery,2,75.00,150.00,0.00,150.00,75.50,74.50,49.7%,LINE,QR,None,None,Trang City,3.6
T0328,2026-02-19,14:25,Thu,Feb,Afternoon,C0157,30,Female,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,ShopeeFood,Card,None,None,Huai Yot,3.6
T0329,2026-06-21,15:55,Sun,Jun,Afternoon,C0355,50,Female,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,9.75,55.25,33.95,21.30,38.6%,Grab,QR,Combo 15%,Weekend Boost,Kantang,4.5
T0330,2026-05-21,13:45,Thu,May,Lunch,C0315,20,Male,VIP,Yes,Matcha Latte,Tea,1,85.00,85.00,12.75,72.25,45.00,27.25,37.7%,ShopeeFood,Cash,Combo 15%,Member Exclusive,Huai Yot,4.0
T0331,2026-01-14,19:55,Wed,Jan,Evening,C0178,21,Female,New,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,28.50,41.50,59.3%,LINE,Cash,None,None,Trang City,4.7
T0332,2026-05-15,12:40,Fri,May,Lunch,C0264,22,Female,Returning,Yes,Peach Tea,Tea,2,70.00,140.00,0.00,140.00,75.20,64.80,46.3%,ShopeeFood,QR,None,None,Huai Yot,4.2
T0333,2026-01-06,17:35,Tue,Jan,Afternoon,C0311,24,Male,New,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,48.30,36.70,43.2%,ShopeeFood,QR,None,None,Huai Yot,4.2
T0334,2026-01-30,09:45,Fri,Jan,Morning,C0347,49,Other,Returning,Yes,French Fries,Snack,1,69.00,69.00,0.00,69.00,31.00,38.00,55.1%,Store,Cash,None,None,Huai Yot,4.0
T0335,2026-01-09,15:35,Fri,Jan,Afternoon,C0030,21,Male,Returning,Yes,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,28.50,41.50,59.3%,LINE,QR,None,None,Trang City,4.3
T0336,2026-02-04,21:15,Wed,Feb,Evening,C0048,18,Male,VIP,Yes,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,37.60,32.40,46.3%,Grab,QR,None,None,Trang City,4.3
T0337,2026-03-24,16:05,Tue,Mar,Afternoon,C0260,22,Male,Returning,No,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,27.75,27.25,49.6%,LINE,Cash,None,None,Trang City,4.2
T0338,2026-02-28,16:30,Sat,Feb,Afternoon,C0067,34,Female,VIP,Yes,Caramel Macchiato,Coffee,3,85.00,255.00,0.00,255.00,111.75,143.25,56.2%,LINE,QR,None,None,Trang City,4.3
T0339,2026-02-27,21:40,Fri,Feb,Evening,C0138,21,Female,Returning,No,Chocolate Cake,Bakery,2,75.00,150.00,0.00,150.00,95.00,55.00,36.7%,Grab,QR,None,None,Trang City,4.3
T0340,2026-02-05,12:55,Thu,Feb,Lunch,C0203,49,Female,New,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,25.00,45.00,64.3%,Store,QR,None,None,Kantang,4.7
T0341,2026-05-07,15:40,Thu,May,Afternoon,C0358,33,Male,New,No,French Fries,Snack,1,69.00,69.00,0.00,69.00,43.42,25.58,37.1%,Grab,QR,None,None,Trang City,4.2
T0342,2026-03-18,13:55,Wed,Mar,Lunch,C0104,34,Female,New,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,ShopeeFood,Cash,None,None,Trang City,4.0
T0343,2026-05-15,17:40,Fri,May,Afternoon,C0238,20,Female,Returning,Yes,French Fries,Snack,1,69.00,69.00,0.00,69.00,34.45,34.55,50.1%,LINE,QR,None,None,Huai Yot,4.3
T0344,2026-05-16,11:30,Sat,May,Lunch,C0023,19,Female,Returning,No,Matcha Latte,Tea,3,85.00,255.00,0.00,255.00,141.90,113.10,44.4%,Grab,QR,None,None,Kantang,4.2
T0345,2026-02-27,10:50,Fri,Feb,Morning,C0247,30,Male,Returning,No,French Fries,Snack,1,69.00,69.00,0.00,69.00,34.45,34.55,50.1%,LINE,QR,None,None,Trang City,4.9
T0346,2026-04-11,19:30,Sat,Apr,Evening,C0186,24,Male,New,No,Thai Tea,Tea,1,65.00,65.00,29.25,35.75,54.43,-18.68,-52.3%,Grab,Card,Buy 1 Get 1,Student Deal,Huai Yot,4.4
T0347,2026-06-19,21:50,Fri,Jun,Evening,C0117,20,Male,Returning,Yes,French Fries,Snack,1,69.00,69.00,0.00,69.00,43.42,25.58,37.1%,Grab,QR,None,None,Trang City,3.9
T0348,2026-05-11,17:45,Mon,May,Afternoon,C0160,19,Male,Returning,Yes,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,32.00,53.00,62.4%,Store,QR,None,None,Huai Yot,4.4
T0349,2026-05-20,12:30,Wed,May,Lunch,C0340,27,Female,New,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,QR,None,None,Huai Yot,3.5
T0350,2026-03-04,16:30,Wed,Mar,Afternoon,C0234,28,Male,Returning,Yes,Matcha Latte,Tea,2,85.00,170.00,0.00,170.00,64.00,106.00,62.4%,Store,Card,None,None,Trang City,3.8
T0351,2026-05-22,10:30,Fri,May,Morning,C0347,27,Female,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,45.00,44.00,49.4%,Store,QR,None,None,Trang City,4.4
T0352,2026-06-16,16:55,Tue,Jun,Afternoon,C0112,18,Female,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,31.75,43.25,57.7%,LINE,Card,None,None,Huai Yot,4.6
T0353,2026-06-15,08:15,Mon,Jun,Morning,C0270,20,Female,Returning,Yes,Thai Tea,Tea,2,65.00,130.00,0.00,130.00,48.00,82.00,63.1%,Store,Card,None,None,Trang City,4.9
T0354,2026-03-06,08:55,Fri,Mar,Morning,C0345,49,Female,Returning,Yes,French Fries,Snack,2,69.00,138.00,0.00,138.00,86.84,51.16,37.1%,Grab,Cash,None,None,Huai Yot,4.1
T0355,2026-06-28,20:25,Sun,Jun,Evening,C0232,24,Female,New,No,Chocolate Cake,Bakery,3,75.00,225.00,0.00,225.00,142.50,82.50,36.7%,ShopeeFood,Card,None,None,Huai Yot,3.9
T0356,2026-02-04,14:10,Wed,Feb,Afternoon,C0191,32,Female,Returning,Yes,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,48.30,36.70,43.2%,ShopeeFood,QR,None,None,Trang City,4.1
T0357,2026-04-23,14:05,Thu,Apr,Afternoon,C0134,43,Male,New,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,QR,None,None,Trang City,3.7
T0358,2026-01-12,09:00,Mon,Jan,Morning,C0214,29,Female,New,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,37.60,32.40,46.3%,ShopeeFood,QR,None,None,Huai Yot,4.4
T0359,2026-06-25,15:05,Thu,Jun,Afternoon,C0236,24,Female,New,No,Peach Tea,Tea,2,70.00,140.00,14.00,126.00,72.68,53.32,42.3%,Grab,QR,10% Discount,Payday,Trang City,3.5
T0360,2026-01-13,18:25,Tue,Jan,Evening,C0215,19,Male,New,No,Americano,Coffee,2,65.00,130.00,26.00,104.00,71.20,32.80,31.5%,LINE,Card,Buy 1 Get 1,Student Deal,Trang City,4.4
T0361,2026-05-27,15:50,Wed,May,Afternoon,C0141,22,Female,New,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,27.25,37.75,58.1%,LINE,QR,None,None,Trang City,4.5
T0362,2026-04-16,14:15,Thu,Apr,Afternoon,C0125,21,Female,Returning,No,Matcha Latte,Tea,2,85.00,170.00,0.00,170.00,94.60,75.40,44.4%,Grab,Card,None,None,Trang City,4.4
T0363,2026-06-02,10:05,Tue,Jun,Morning,C0156,35,Male,New,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,36.25,48.75,57.4%,LINE,QR,None,None,Huai Yot,4.1
T0364,2026-02-02,19:20,Mon,Feb,Evening,C0215,20,Male,Returning,Yes,French Fries,Snack,1,69.00,69.00,6.90,62.10,42.18,19.92,32.1%,Grab,QR,10% Discount,Student Deal,Trang City,4.2
T0365,2026-04-22,15:45,Wed,Apr,Afternoon,C0035,29,Female,VIP,Yes,French Fries,Snack,1,69.00,69.00,10.35,58.65,31.00,27.65,47.1%,Store,QR,Combo 15%,Member Exclusive,Trang City,4.3
T0366,2026-06-11,10:45,Thu,Jun,Morning,C0131,37,Female,VIP,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,25.25,39.75,61.2%,LINE,QR,None,None,Trang City,4.1
T0367,2026-01-09,18:05,Fri,Jan,Evening,C0210,23,Male,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,29.25,35.75,49.79,-14.04,-39.3%,LINE,QR,Buy 1 Get 1,Student Deal,Kantang,4.6
T0368,2026-01-01,17:10,Thu,Jan,Afternoon,C0020,20,Male,Returning,Yes,Thai Tea,Tea,2,65.00,130.00,0.00,130.00,71.40,58.60,45.1%,ShopeeFood,Card,None,None,Trang City,3.8
T0369,2026-06-14,08:20,Sun,Jun,Morning,C0301,20,Female,Returning,No,Caramel Macchiato,Coffee,2,85.00,170.00,0.00,170.00,66.00,104.00,61.2%,Store,Card,None,None,Huai Yot,4.6
T0370,2026-06-11,15:05,Thu,Jun,Afternoon,C0151,28,Female,Returning,Yes,Americano,Coffee,1,65.00,65.00,0.00,65.00,33.70,31.30,48.2%,ShopeeFood,QR,None,None,Trang City,3.4
T0371,2026-05-23,10:55,Sat,May,Morning,C0360,19,Female,Returning,Yes,Caramel Macchiato,Coffee,2,85.00,170.00,25.50,144.50,92.01,52.49,36.3%,Grab,QR,Combo 15%,Weekend Boost,Trang City,4.3
T0372,2026-06-09,14:50,Tue,Jun,Afternoon,C0360,30,Female,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,25.00,30.00,54.6%,Store,Card,None,None,Trang City,4.3
T0373,2026-02-21,21:35,Sat,Feb,Evening,C0134,23,Male,Returning,No,Iced Latte,Coffee,1,75.00,75.00,11.25,63.75,39.47,24.28,38.1%,Grab,QR,Combo 15%,Weekend Boost,Trang City,3.7
T0374,2026-03-26,19:45,Thu,Mar,Evening,C0176,21,Female,Returning,No,Butter Croissant,Bakery,3,55.00,165.00,16.50,148.50,101.73,46.77,31.5%,Grab,QR,10% Discount,Student Deal,Huai Yot,3.7
T0375,2026-02-27,09:30,Fri,Feb,Morning,C0199,31,Female,VIP,Yes,Iced Latte,Coffee,2,75.00,150.00,22.50,127.50,56.00,71.50,56.1%,Store,Card,Combo 15%,Member Exclusive,Huai Yot,4.2
T0376,2026-02-26,15:45,Thu,Feb,Afternoon,C0072,35,Female,New,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,25.25,39.75,61.2%,LINE,QR,None,None,Huai Yot,3.9
T0377,2026-03-22,16:45,Sun,Mar,Afternoon,C0224,22,Male,Returning,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,36.25,48.75,57.4%,LINE,QR,None,None,Trang City,4.0
T0378,2026-04-02,11:35,Thu,Apr,Lunch,C0176,20,Male,VIP,Yes,Americano,Coffee,1,65.00,65.00,0.00,65.00,22.00,43.00,66.2%,Store,QR,None,None,Trang City,4.3
T0379,2026-03-22,16:20,Sun,Mar,Afternoon,C0275,23,Male,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,9.75,55.25,33.95,21.30,38.6%,Grab,Card,Combo 15%,Weekend Boost,Trang City,4.2
T0380,2026-06-26,12:30,Fri,Jun,Lunch,C0197,34,Female,New,No,Americano,Coffee,1,65.00,65.00,6.50,58.50,22.00,36.50,62.4%,Store,QR,10% Discount,Payday,Kantang,4.6
T0381,2026-06-14,21:10,Sun,Jun,Evening,C0181,24,Male,Returning,Yes,Americano,Coffee,1,65.00,65.00,9.75,55.25,31.95,23.30,42.2%,Grab,QR,Combo 15%,Weekend Boost,Trang City,4.4
T0382,2026-04-22,14:20,Wed,Apr,Afternoon,C0144,21,Male,Returning,No,Chocolate Cake,Bakery,2,75.00,150.00,0.00,150.00,95.00,55.00,36.7%,Grab,Card,None,None,Huai Yot,4.7
T0383,2026-04-28,20:50,Tue,Apr,Evening,C0103,21,Male,New,No,Matcha Latte,Tea,2,85.00,170.00,17.00,153.00,71.65,81.35,53.2%,LINE,QR,10% Discount,Payday,Trang City,4.2
T0384,2026-02-18,19:40,Wed,Feb,Evening,C0278,23,Female,New,No,Thai Tea,Tea,2,65.00,130.00,0.00,130.00,48.00,82.00,63.1%,Store,Card,None,None,Huai Yot,4.1
T0385,2026-05-08,10:50,Fri,May,Morning,C0130,26,Male,New,No,Peach Tea,Tea,2,70.00,140.00,0.00,140.00,75.20,64.80,46.3%,ShopeeFood,Card,None,None,Trang City,4.0
T0386,2026-01-12,17:05,Mon,Jan,Afternoon,C0315,19,Female,Returning,Yes,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,32.00,53.00,62.4%,Store,QR,None,None,Trang City,4.6
T0387,2026-02-27,10:45,Fri,Feb,Morning,C0181,37,Female,VIP,Yes,Butter Croissant,Bakery,2,55.00,110.00,0.00,110.00,69.80,40.20,36.6%,Grab,QR,None,None,Kantang,4.0
T0388,2026-05-31,21:15,Sun,May,Evening,C0217,20,Female,Returning,Yes,French Fries,Snack,3,69.00,207.00,20.70,186.30,102.32,83.98,45.1%,LINE,Cash,10% Discount,Payday,Trang City,4.1
T0389,2026-02-27,14:45,Fri,Feb,Afternoon,C0246,25,Female,New,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,45.00,44.00,49.4%,Store,Card,None,None,Huai Yot,4.1
T0390,2026-06-10,20:50,Wed,Jun,Evening,C0177,19,Male,New,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,Grab,QR,None,None,Trang City,4.0
T0391,2026-03-15,15:05,Sun,Mar,Afternoon,C0354,29,Male,Returning,Yes,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,32.00,53.00,62.4%,Store,QR,None,None,Trang City,3.9
T0392,2026-03-31,15:40,Tue,Mar,Afternoon,C0299,28,Female,Returning,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,37.60,32.40,46.3%,Grab,Cash,None,None,Trang City,3.9
T0393,2026-04-03,15:30,Fri,Apr,Afternoon,C0041,24,Male,Returning,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,27.25,37.75,58.1%,LINE,Cash,None,None,Trang City,4.4
T0394,2026-01-24,11:30,Sat,Jan,Lunch,C0294,51,Male,Returning,Yes,Matcha Latte,Tea,3,85.00,255.00,38.25,216.75,96.00,120.75,55.7%,Store,Cash,Combo 15%,Weekend Boost,Trang City,3.9
T0395,2026-06-10,14:35,Wed,Jun,Afternoon,C0357,24,Male,New,No,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,83.00,67.00,44.7%,Grab,QR,None,None,Trang City,4.0
T0396,2026-03-02,21:55,Mon,Mar,Evening,C0204,18,Female,New,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,35.70,29.30,45.1%,ShopeeFood,QR,None,None,Kantang,4.3
T0397,2026-05-10,19:50,Sun,May,Evening,C0271,24,Male,New,No,Chocolate Cake,Bakery,1,75.00,75.00,11.25,63.75,37.19,26.56,41.7%,LINE,QR,Combo 15%,Weekend Boost,Huai Yot,4.7
T0398,2026-02-26,16:40,Thu,Feb,Afternoon,C0228,24,Male,Returning,Yes,Thai Tea,Tea,2,65.00,130.00,0.00,130.00,71.40,58.60,45.1%,Grab,QR,None,None,Trang City,4.2
T0399,2026-05-24,21:25,Sun,May,Evening,C0183,24,Female,Returning,No,Thai Tea,Tea,1,65.00,65.00,9.75,55.25,26.76,28.49,51.6%,LINE,QR,Combo 15%,Weekend Boost,Trang City,4.7
T0400,2026-01-28,17:20,Wed,Jan,Afternoon,C0229,27,Female,New,No,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,56.00,94.00,62.7%,Store,QR,None,None,Trang City,4.1
T0401,2026-01-07,13:40,Wed,Jan,Lunch,C0011,38,Female,New,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,33.70,31.30,48.2%,Grab,Card,None,None,Trang City,3.8
T0402,2026-06-29,11:25,Mon,Jun,Lunch,C0071,23,Female,New,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,45.00,44.00,49.4%,Store,QR,None,None,Huai Yot,4.5
T0403,2026-06-05,21:05,Fri,Jun,Evening,C0184,24,Male,VIP,Yes,Thai Tea,Tea,3,65.00,195.00,0.00,195.00,107.10,87.90,45.1%,Grab,Card,None,None,Huai Yot,4.0
T0404,2026-03-22,20:15,Sun,Mar,Evening,C0333,19,Female,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,35.70,29.30,45.1%,ShopeeFood,QR,None,None,Trang City,4.3
T0405,2026-05-16,19:25,Sat,May,Evening,C0317,24,Male,Returning,Yes,Peach Tea,Tea,2,70.00,140.00,14.00,126.00,72.68,53.32,42.3%,Grab,Card,10% Discount,Student Deal,Trang City,3.6
T0406,2026-05-19,16:40,Tue,May,Afternoon,C0323,37,Male,VIP,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,QR,None,None,Huai Yot,4.8
T0407,2026-03-20,09:35,Fri,Mar,Morning,C0285,55,Male,New,No,Caramel Macchiato,Coffee,2,85.00,170.00,0.00,170.00,96.60,73.40,43.2%,ShopeeFood,QR,None,None,Trang City,4.5
T0408,2026-01-21,09:50,Wed,Jan,Morning,C0308,40,Female,Returning,No,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,27.75,27.25,49.6%,LINE,QR,None,None,Trang City,4.9
T0409,2026-03-15,13:20,Sun,Mar,Lunch,C0166,29,Female,Returning,Yes,Chocolate Cake,Bakery,3,75.00,225.00,33.75,191.25,111.56,79.69,41.7%,LINE,QR,Combo 15%,Weekend Boost,Trang City,3.9
T0410,2026-05-24,11:25,Sun,May,Lunch,C0216,43,Male,Returning,Yes,Butter Croissant,Bakery,3,55.00,165.00,0.00,165.00,104.70,60.30,36.6%,ShopeeFood,QR,None,None,Huai Yot,4.6
T0411,2026-04-21,12:45,Tue,Apr,Lunch,C0126,33,Female,VIP,Yes,Peach Tea,Tea,2,70.00,140.00,21.00,119.00,71.42,47.58,40.0%,Grab,Card,Combo 15%,Member Exclusive,Trang City,4.4
T0412,2026-05-11,13:30,Mon,May,Lunch,C0023,28,Male,Returning,Yes,Caramel Macchiato,Coffee,2,85.00,170.00,0.00,170.00,66.00,104.00,61.2%,Store,Card,None,None,Trang City,4.7
T0413,2026-04-29,14:00,Wed,Apr,Afternoon,C0062,27,Male,New,No,French Fries,Snack,1,69.00,69.00,0.00,69.00,31.00,38.00,55.1%,Store,QR,None,None,Trang City,4.3
T0414,2026-02-06,14:45,Fri,Feb,Afternoon,C0060,21,Female,Returning,Yes,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,47.50,27.50,36.7%,ShopeeFood,Card,None,None,Trang City,4.1
T0415,2026-06-15,21:20,Mon,Jun,Evening,C0266,19,Female,New,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,22.00,43.00,66.2%,Store,QR,None,None,Trang City,4.4
T0416,2026-01-31,17:00,Sat,Jan,Afternoon,C0342,23,Female,New,No,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,27.75,27.25,49.6%,LINE,QR,None,None,Trang City,4.3
T0417,2026-05-26,08:25,Tue,May,Morning,C0270,43,Male,VIP,Yes,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,24.00,41.00,63.1%,Store,Cash,None,None,Trang City,4.4
T0418,2026-02-25,17:30,Wed,Feb,Afternoon,C0162,21,Male,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,7.50,67.50,31.38,36.12,53.5%,LINE,Card,10% Discount,Payday,Trang City,3.9
T0419,2026-02-09,10:15,Mon,Feb,Morning,C0025,22,Female,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,35.70,29.30,45.1%,ShopeeFood,QR,None,None,Trang City,4.2
T0420,2026-01-17,15:55,Sat,Jan,Afternoon,C0209,24,Female,Returning,Yes,Peach Tea,Tea,3,70.00,210.00,31.50,178.50,107.13,71.37,40.0%,ShopeeFood,QR,Combo 15%,Weekend Boost,Huai Yot,4.0
T0421,2026-03-20,15:50,Fri,Mar,Afternoon,C0319,53,Female,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,31.75,43.25,57.7%,LINE,QR,None,None,Kantang,4.5
T0422,2026-06-10,19:55,Wed,Jun,Evening,C0300,18,Female,Returning,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,8.90,80.10,49.00,31.10,38.8%,LINE,Card,10% Discount,Student Deal,Huai Yot,3.9
T0423,2026-04-14,21:00,Tue,Apr,Evening,C0017,30,Female,New,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,37.25,47.75,56.2%,LINE,QR,None,None,Trang City,4.3
T0424,2026-05-10,20:45,Sun,May,Evening,C0111,21,Female,New,No,Iced Latte,Coffee,1,75.00,75.00,11.25,63.75,39.47,24.28,38.1%,Grab,Card,Combo 15%,Weekend Boost,Trang City,4.1
T0425,2026-05-13,10:35,Wed,May,Morning,C0172,50,Male,VIP,Yes,Matcha Latte,Tea,3,85.00,255.00,38.25,216.75,106.84,109.91,50.7%,LINE,Card,Combo 15%,Member Exclusive,Trang City,4.3
T0426,2026-04-28,09:15,Tue,Apr,Morning,C0014,35,Female,New,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,36.25,48.75,57.4%,LINE,QR,None,None,Trang City,4.2
T0427,2026-05-16,21:20,Sat,May,Evening,C0122,20,Female,Returning,Yes,Caramel Macchiato,Coffee,2,85.00,170.00,0.00,170.00,66.00,104.00,61.2%,Store,Cash,None,None,Trang City,4.0
T0428,2026-04-17,16:50,Fri,Apr,Afternoon,C0080,26,Female,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,Grab,QR,None,None,Trang City,4.3
T0429,2026-02-27,18:50,Fri,Feb,Evening,C0074,25,Male,New,No,Americano,Coffee,1,65.00,65.00,6.50,58.50,22.00,36.50,62.4%,Store,Card,10% Discount,Payday,Kantang,3.8
T0430,2026-06-08,20:15,Mon,Jun,Evening,C0262,24,Male,New,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,Grab,QR,None,None,Trang City,3.9
T0431,2026-01-24,18:20,Sat,Jan,Evening,C0246,26,Female,VIP,No,Chocolate Cake,Bakery,3,75.00,225.00,0.00,225.00,142.50,82.50,36.7%,Grab,QR,None,None,Trang City,4.3
T0432,2026-02-17,10:05,Tue,Feb,Morning,C0151,27,Female,Returning,Yes,French Fries,Snack,1,69.00,69.00,0.00,69.00,43.42,25.58,37.1%,Grab,QR,None,None,Trang City,4.1
T0433,2026-05-13,21:05,Wed,May,Evening,C0132,28,Male,VIP,Yes,Caramel Macchiato,Coffee,2,85.00,170.00,0.00,170.00,96.60,73.40,43.2%,ShopeeFood,QR,None,None,Trang City,4.3
T0434,2026-05-03,09:55,Sun,May,Morning,C0017,44,Male,Returning,Yes,Americano,Coffee,1,65.00,65.00,0.00,65.00,22.00,43.00,66.2%,Store,Cash,None,None,Kantang,4.9
T0435,2026-04-13,14:10,Mon,Apr,Afternoon,C0138,18,Male,Returning,Yes,Ham Cheese Sandwich,Snack,2,89.00,178.00,0.00,178.00,98.90,79.10,44.4%,LINE,Card,None,None,Trang City,3.4
T0436,2026-06-10,17:40,Wed,Jun,Afternoon,C0094,23,Female,New,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,37.25,47.75,56.2%,LINE,QR,None,None,Huai Yot,3.9
T0437,2026-06-27,10:10,Sat,Jun,Morning,C0232,27,Male,Returning,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,25.00,45.00,64.3%,Store,Cash,None,None,Trang City,5.0
T0438,2026-06-30,13:05,Tue,Jun,Lunch,C0133,31,Male,Returning,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,33.00,52.00,61.2%,Store,QR,None,None,Huai Yot,4.7
T0439,2026-04-22,11:05,Wed,Apr,Lunch,C0109,21,Female,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,Grab,QR,None,None,Trang City,4.5
T0440,2026-04-12,12:55,Sun,Apr,Lunch,C0089,39,Female,New,No,Matcha Latte,Tea,2,85.00,170.00,0.00,170.00,94.60,75.40,44.4%,ShopeeFood,QR,None,None,Trang City,4.1
T0441,2026-03-24,17:20,Tue,Mar,Afternoon,C0067,22,Female,New,No,French Fries,Snack,2,69.00,138.00,0.00,138.00,86.84,51.16,37.1%,Grab,QR,None,None,Trang City,4.2
T0442,2026-05-07,19:50,Thu,May,Evening,C0360,22,Female,New,No,Iced Latte,Coffee,1,75.00,75.00,33.75,41.25,63.42,-22.17,-53.8%,Grab,Cash,Buy 1 Get 1,Student Deal,Trang City,4.7
T0443,2026-02-07,16:50,Sat,Feb,Afternoon,C0002,22,Female,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,31.75,43.25,57.7%,LINE,Card,None,None,Trang City,4.3
T0444,2026-06-09,16:20,Tue,Jun,Afternoon,C0197,21,Male,New,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,36.25,48.75,57.4%,LINE,Card,None,None,Huai Yot,4.1
T0445,2026-06-19,10:10,Fri,Jun,Morning,C0132,32,Female,New,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,22.00,43.00,66.2%,Store,Card,None,None,Trang City,4.4
T0446,2026-02-07,12:15,Sat,Feb,Lunch,C0075,38,Female,Returning,Yes,Ham Cheese Sandwich,Snack,2,89.00,178.00,26.70,151.30,90.00,61.30,40.5%,Store,QR,Combo 15%,Weekend Boost,Trang City,4.5
T0447,2026-03-25,18:55,Wed,Mar,Evening,C0189,24,Female,Returning,Yes,Americano,Coffee,1,65.00,65.00,0.00,65.00,22.00,43.00,66.2%,Store,QR,None,None,Trang City,4.7
T0448,2026-06-26,10:20,Fri,Jun,Morning,C0321,39,Male,VIP,Yes,Americano,Coffee,2,65.00,130.00,19.50,110.50,44.00,66.50,60.2%,Store,Cash,Combo 15%,Member Exclusive,Trang City,4.4
T0449,2026-01-16,11:00,Fri,Jan,Lunch,C0035,36,Male,Returning,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,22.00,43.00,66.2%,Store,Card,None,None,Trang City,4.0
T0450,2026-03-04,21:40,Wed,Mar,Evening,C0053,28,Male,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,61.02,27.98,31.4%,ShopeeFood,QR,None,None,Huai Yot,4.6
T0451,2026-04-04,12:30,Sat,Apr,Lunch,C0130,27,Female,New,No,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,47.50,27.50,36.7%,Grab,QR,None,None,Kantang,4.6
T0452,2026-01-24,08:50,Sat,Jan,Morning,C0184,27,Female,VIP,Yes,Americano,Coffee,1,65.00,65.00,9.75,55.25,22.00,33.25,60.2%,Store,Card,Combo 15%,Member Exclusive,Trang City,4.1
T0453,2026-04-25,19:20,Sat,Apr,Evening,C0314,26,Female,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,8.90,80.10,45.00,35.10,43.8%,Store,QR,10% Discount,Payday,Huai Yot,3.8
T0454,2026-01-21,16:50,Wed,Jan,Afternoon,C0028,18,Female,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,49.45,39.55,44.4%,LINE,Cash,None,None,Huai Yot,3.9
T0455,2026-04-24,13:55,Fri,Apr,Lunch,C0189,39,Female,VIP,Yes,Butter Croissant,Bakery,2,55.00,110.00,0.00,110.00,50.00,60.00,54.6%,Store,Cash,None,None,Trang City,4.6
T0456,2026-06-24,17:55,Wed,Jun,Afternoon,C0175,42,Male,New,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,45.00,44.00,49.4%,Store,QR,None,None,Trang City,4.5
T0457,2026-05-22,19:05,Fri,May,Evening,C0085,18,Male,New,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,48.30,36.70,43.2%,Grab,QR,None,None,Trang City,4.2
T0458,2026-03-12,19:10,Thu,Mar,Evening,C0038,40,Female,VIP,Yes,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,25.00,30.00,54.6%,Store,Card,None,None,Trang City,4.3
T0459,2026-01-26,20:45,Mon,Jan,Evening,C0220,20,Female,New,No,Caramel Macchiato,Coffee,2,85.00,170.00,0.00,170.00,96.60,73.40,43.2%,Grab,Card,None,None,Trang City,4.5
T0460,2026-01-12,20:15,Mon,Jan,Evening,C0360,18,Female,New,No,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,37.75,37.25,49.7%,LINE,Card,None,None,Trang City,4.1
T0461,2026-05-31,11:55,Sun,May,Lunch,C0191,28,Female,Returning,Yes,French Fries,Snack,2,69.00,138.00,0.00,138.00,62.00,76.00,55.1%,Store,QR,None,None,Trang City,4.6
T0462,2026-05-22,12:15,Fri,May,Lunch,C0003,33,Female,Returning,No,French Fries,Snack,1,69.00,69.00,0.00,69.00,31.00,38.00,55.1%,Store,Cash,None,None,Huai Yot,4.3
T0463,2026-01-24,20:50,Sat,Jan,Evening,C0102,24,Female,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,6.50,58.50,34.53,23.97,41.0%,ShopeeFood,QR,10% Discount,Student Deal,Trang City,4.2
T0464,2026-03-22,21:20,Sun,Mar,Evening,C0036,19,Female,New,No,Iced Latte,Coffee,1,75.00,75.00,7.50,67.50,31.38,36.12,53.5%,LINE,QR,10% Discount,Student Deal,Trang City,4.7
T0465,2026-03-10,21:25,Tue,Mar,Evening,C0013,18,Male,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,QR,None,None,Trang City,3.6
T0466,2026-06-01,11:45,Mon,Jun,Lunch,C0092,28,Female,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,35.70,29.30,45.1%,Grab,QR,None,None,Trang City,4.2
T0467,2026-05-19,18:20,Tue,May,Evening,C0063,28,Male,New,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,25.00,45.00,64.3%,Store,QR,None,None,Trang City,4.2
T0468,2026-01-09,17:40,Fri,Jan,Afternoon,C0058,22,Female,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,49.45,39.55,44.4%,LINE,Cash,None,None,Huai Yot,4.0
T0469,2026-04-10,20:40,Fri,Apr,Evening,C0343,34,Female,Returning,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,22.00,43.00,66.2%,Store,Card,None,None,Trang City,4.3
T0470,2026-05-16,13:55,Sat,May,Lunch,C0162,19,Female,New,No,French Fries,Snack,1,69.00,69.00,0.00,69.00,43.42,25.58,37.1%,ShopeeFood,QR,None,None,Huai Yot,4.0
T0471,2026-06-13,14:40,Sat,Jun,Afternoon,C0214,21,Female,Returning,Yes,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,28.50,41.50,59.3%,LINE,QR,None,None,Trang City,4.9
T0472,2026-02-08,18:50,Sun,Feb,Evening,C0247,23,Male,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,61.02,27.98,31.4%,ShopeeFood,Card,None,None,Huai Yot,4.1
T0473,2026-05-01,10:45,Fri,May,Morning,C0305,35,Male,Returning,Yes,Americano,Coffee,1,65.00,65.00,0.00,65.00,25.25,39.75,61.2%,LINE,Card,None,None,Trang City,4.3
T0474,2026-05-06,17:35,Wed,May,Afternoon,C0076,22,Male,New,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,33.70,31.30,48.2%,Grab,QR,None,None,Trang City,3.8
T0475,2026-06-24,15:25,Wed,Jun,Afternoon,C0079,24,Female,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,31.75,43.25,57.7%,LINE,QR,None,None,Kantang,4.5
T0476,2026-02-04,18:45,Wed,Feb,Evening,C0255,23,Female,Returning,Yes,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,47.50,27.50,36.7%,Grab,QR,None,None,Trang City,3.6
T0477,2026-06-14,09:00,Sun,Jun,Morning,C0052,37,Female,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,45.00,44.00,49.4%,Store,Card,None,None,Trang City,3.9
T0478,2026-06-25,09:00,Thu,Jun,Morning,C0080,53,Female,Returning,No,Chocolate Cake,Bakery,1,75.00,75.00,7.50,67.50,37.38,30.12,44.6%,LINE,Card,10% Discount,Payday,Trang City,4.3
T0479,2026-06-09,14:45,Tue,Jun,Afternoon,C0350,28,Male,New,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,25.00,45.00,64.3%,Store,QR,None,None,Trang City,3.9
T0480,2026-02-12,11:25,Thu,Feb,Lunch,C0210,24,Female,Returning,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,61.02,27.98,31.4%,Grab,QR,None,None,Huai Yot,4.2
T0481,2026-06-03,11:40,Wed,Jun,Lunch,C0047,33,Female,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,27.75,27.25,49.6%,LINE,Card,None,None,Huai Yot,4.7
T0482,2026-05-09,21:45,Sat,May,Evening,C0347,22,Female,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,24.75,30.25,55.44,-25.19,-83.3%,ShopeeFood,QR,Buy 1 Get 1,Student Deal,Trang City,3.5
T0483,2026-01-28,21:45,Wed,Jan,Evening,C0322,19,Male,New,No,Peach Tea,Tea,1,70.00,70.00,7.00,63.00,28.15,34.85,55.3%,LINE,Card,10% Discount,Student Deal,Trang City,4.3
T0484,2026-02-02,20:50,Mon,Feb,Evening,C0042,18,Female,New,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,35.70,29.30,45.1%,ShopeeFood,QR,None,None,Trang City,4.4
T0485,2026-06-09,15:30,Tue,Jun,Afternoon,C0188,23,Female,Returning,Yes,French Fries,Snack,1,69.00,69.00,0.00,69.00,34.45,34.55,50.1%,LINE,QR,None,None,Huai Yot,4.7
T0486,2026-01-12,18:55,Mon,Jan,Evening,C0149,24,Male,Returning,Yes,Iced Latte,Coffee,2,75.00,150.00,30.00,120.00,105.60,14.40,12.0%,Grab,Cash,Buy 1 Get 1,Student Deal,Trang City,4.5
T0487,2026-03-10,21:30,Tue,Mar,Evening,C0143,21,Female,New,No,Matcha Latte,Tea,1,85.00,85.00,8.50,76.50,45.77,30.73,40.2%,Grab,QR,10% Discount,Student Deal,Trang City,4.5
T0488,2026-01-20,16:00,Tue,Jan,Afternoon,C0010,21,Female,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,45.00,44.00,49.4%,Store,QR,None,None,Trang City,4.0
T0489,2026-04-21,21:30,Tue,Apr,Evening,C0308,23,Male,Returning,Yes,Peach Tea,Tea,2,70.00,140.00,0.00,140.00,75.20,64.80,46.3%,Grab,QR,None,None,Trang City,3.8
T0490,2026-01-03,18:50,Sat,Jan,Evening,C0344,37,Male,Returning,Yes,Ham Cheese Sandwich,Snack,2,89.00,178.00,0.00,178.00,90.00,88.00,49.4%,Store,QR,None,None,Trang City,4.4
T0491,2026-04-12,13:00,Sun,Apr,Lunch,C0292,30,Female,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,8.25,46.75,33.41,13.34,28.5%,ShopeeFood,QR,Combo 15%,Weekend Boost,Trang City,4.4
T0492,2026-05-19,20:30,Tue,May,Evening,C0345,20,Female,Returning,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,Grab,QR,None,None,Trang City,4.4
T0493,2026-05-02,10:20,Sat,May,Morning,C0049,42,Female,Returning,No,Chocolate Cake,Bakery,1,75.00,75.00,11.25,63.75,45.47,18.28,28.7%,Grab,Cash,Combo 15%,Weekend Boost,Huai Yot,4.3
T0494,2026-04-09,14:45,Thu,Apr,Afternoon,C0318,30,Male,Returning,Yes,French Fries,Snack,1,69.00,69.00,0.00,69.00,31.00,38.00,55.1%,Store,Card,None,None,Trang City,4.4
T0495,2026-03-31,15:05,Tue,Mar,Afternoon,C0054,39,Male,VIP,Yes,Americano,Coffee,1,65.00,65.00,9.75,55.25,24.76,30.49,55.2%,LINE,QR,Combo 15%,Member Exclusive,Trang City,3.7
T0496,2026-05-20,19:50,Wed,May,Evening,C0182,19,Female,Returning,Yes,French Fries,Snack,1,69.00,69.00,0.00,69.00,43.42,25.58,37.1%,Grab,QR,None,None,Trang City,4.1
T0497,2026-01-27,14:10,Tue,Jan,Afternoon,C0218,21,Female,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,6.50,58.50,26.93,31.57,54.0%,LINE,QR,10% Discount,Payday,Huai Yot,4.6
T0498,2026-02-02,17:40,Mon,Feb,Afternoon,C0042,21,Female,New,No,Thai Tea,Tea,2,65.00,130.00,0.00,130.00,54.50,75.50,58.1%,LINE,Card,None,None,Kantang,4.2
T0499,2026-04-02,12:35,Thu,Apr,Lunch,C0217,22,Female,New,No,Caramel Macchiato,Coffee,2,85.00,170.00,0.00,170.00,74.50,95.50,56.2%,LINE,QR,None,None,Trang City,3.4
T0500,2026-05-12,11:30,Tue,May,Lunch,C0232,20,Female,Returning,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,Grab,QR,None,None,Trang City,4.3
T0501,2026-06-28,20:20,Sun,Jun,Evening,C0106,24,Male,New,No,Americano,Coffee,2,65.00,130.00,26.00,104.00,84.72,19.28,18.5%,ShopeeFood,QR,Buy 1 Get 1,Student Deal,Trang City,3.9
T0502,2026-02-18,19:25,Wed,Feb,Evening,C0179,22,Female,New,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,35.70,29.30,45.1%,Grab,QR,None,None,Trang City,4.0
T0503,2026-05-25,11:40,Mon,May,Lunch,C0078,31,Female,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,24.00,41.00,63.1%,Store,QR,None,None,Trang City,4.2
T0504,2026-04-29,21:40,Wed,Apr,Evening,C0024,19,Female,New,No,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,47.50,27.50,36.7%,Grab,QR,None,None,Huai Yot,4.0
T0505,2026-03-05,19:15,Thu,Mar,Evening,C0248,18,Female,Returning,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,33.70,31.30,48.2%,Grab,Card,None,None,Trang City,4.4
T0506,2026-03-31,16:15,Tue,Mar,Afternoon,C0155,49,Male,Returning,Yes,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,37.25,47.75,56.2%,LINE,QR,None,None,Trang City,4.4
T0507,2026-02-28,17:00,Sat,Feb,Afternoon,C0314,37,Male,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,25.00,30.00,54.6%,Store,QR,None,None,Huai Yot,4.2
T0508,2026-06-16,08:30,Tue,Jun,Morning,C0126,29,Female,New,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,45.00,44.00,49.4%,Store,Card,None,None,Trang City,4.2
T0509,2026-04-07,14:35,Tue,Apr,Afternoon,C0054,33,Female,Returning,Yes,Chocolate Cake,Bakery,2,75.00,150.00,0.00,150.00,68.00,82.00,54.7%,Store,Cash,None,None,Trang City,4.0
T0510,2026-03-19,16:05,Thu,Mar,Afternoon,C0057,32,Female,Returning,Yes,Caramel Macchiato,Coffee,3,85.00,255.00,0.00,255.00,144.90,110.10,43.2%,Grab,QR,None,None,Kantang,4.7
T0511,2026-04-04,12:15,Sat,Apr,Lunch,C0351,19,Female,New,No,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,37.75,37.25,49.7%,LINE,QR,None,None,Trang City,4.4
T0512,2026-06-10,10:00,Wed,Jun,Morning,C0153,44,Male,New,No,Ham Cheese Sandwich,Snack,3,89.00,267.00,0.00,267.00,183.06,83.94,31.4%,Grab,QR,None,None,Trang City,4.3
T0513,2026-05-01,18:15,Fri,May,Evening,C0170,25,Male,Returning,Yes,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,33.00,52.00,61.2%,Store,Cash,None,None,Huai Yot,3.8
T0514,2026-05-08,12:10,Fri,May,Lunch,C0127,27,Male,Returning,No,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,25.00,30.00,54.6%,Store,Cash,None,None,Kantang,4.1
T0515,2026-06-03,11:50,Wed,Jun,Lunch,C0254,19,Female,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,31.75,43.25,57.7%,LINE,QR,None,None,Huai Yot,4.6
T0516,2026-01-01,18:35,Thu,Jan,Evening,C0261,23,Female,New,No,Chocolate Cake,Bakery,2,75.00,150.00,0.00,150.00,75.50,74.50,49.7%,LINE,QR,None,None,Huai Yot,4.1
T0517,2026-06-21,21:45,Sun,Jun,Evening,C0293,20,Female,Returning,Yes,Caramel Macchiato,Coffee,1,85.00,85.00,8.50,76.50,46.77,29.73,38.9%,ShopeeFood,Card,10% Discount,Student Deal,Trang City,3.8
T0518,2026-06-28,20:10,Sun,Jun,Evening,C0294,26,Male,VIP,Yes,Caramel Macchiato,Coffee,2,85.00,170.00,25.50,144.50,92.01,52.49,36.3%,Grab,Card,Combo 15%,Weekend Boost,Kantang,4.1
T0519,2026-02-15,11:55,Sun,Feb,Lunch,C0157,20,Female,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,31.75,43.25,57.7%,LINE,QR,None,None,Trang City,4.1
T0520,2026-04-06,12:55,Mon,Apr,Lunch,C0218,20,Female,New,No,Butter Croissant,Bakery,3,55.00,165.00,0.00,165.00,104.70,60.30,36.6%,Grab,QR,None,None,Trang City,4.3
T0521,2026-04-10,21:15,Fri,Apr,Evening,C0346,20,Female,New,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,48.30,36.70,43.2%,Grab,Cash,None,None,Huai Yot,4.5
T0522,2026-03-15,15:30,Sun,Mar,Afternoon,C0030,31,Male,Returning,Yes,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,56.00,94.00,62.7%,Store,QR,None,None,Huai Yot,4.1
T0523,2026-03-04,17:45,Wed,Mar,Afternoon,C0063,25,Male,New,No,French Fries,Snack,1,69.00,69.00,0.00,69.00,31.00,38.00,55.1%,Store,QR,None,None,Trang City,4.6
T0524,2026-05-04,13:45,Mon,May,Lunch,C0213,37,Male,New,No,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,27.75,27.25,49.6%,LINE,Card,None,None,Huai Yot,4.8
T0525,2026-04-10,21:00,Fri,Apr,Evening,C0039,37,Female,VIP,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,61.02,27.98,31.4%,Grab,Card,None,None,Trang City,3.7
T0526,2026-02-20,14:35,Fri,Feb,Afternoon,C0348,34,Male,VIP,Yes,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,25.00,45.00,64.3%,Store,Cash,None,None,Trang City,3.7
T0527,2026-06-03,11:40,Wed,Jun,Lunch,C0232,39,Male,New,No,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,34.90,20.10,36.6%,Grab,QR,None,None,Trang City,4.5
T0528,2026-03-28,08:25,Sat,Mar,Morning,C0204,23,Female,VIP,Yes,Matcha Latte,Tea,2,85.00,170.00,25.50,144.50,64.00,80.50,55.7%,Store,QR,Combo 15%,Member Exclusive,Huai Yot,4.0
T0529,2026-05-26,18:25,Tue,May,Evening,C0031,19,Other,Returning,Yes,Chocolate Cake,Bakery,1,75.00,75.00,7.50,67.50,46.15,21.35,31.6%,ShopeeFood,QR,10% Discount,Student Deal,Trang City,3.8
T0530,2026-03-25,13:30,Wed,Mar,Lunch,C0294,26,Male,Returning,Yes,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,34.00,41.00,54.7%,Store,QR,None,None,Trang City,3.5
T0531,2026-02-20,08:55,Fri,Feb,Morning,C0020,18,Male,New,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,37.25,47.75,56.2%,LINE,QR,None,None,Huai Yot,3.8
T0532,2026-02-17,08:00,Tue,Feb,Morning,C0251,18,Female,New,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,Grab,Card,None,None,Trang City,3.9
T0533,2026-05-17,15:05,Sun,May,Afternoon,C0094,45,Male,Returning,Yes,Thai Tea,Tea,2,65.00,130.00,19.50,110.50,48.00,62.50,56.6%,Store,Card,Combo 15%,Weekend Boost,Trang City,4.2
T0534,2026-04-20,10:25,Mon,Apr,Morning,C0254,22,Female,New,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,QR,None,None,Trang City,4.4
T0535,2026-04-23,19:15,Thu,Apr,Evening,C0170,22,Female,VIP,Yes,Caramel Macchiato,Coffee,2,85.00,170.00,34.00,136.00,105.80,30.20,22.2%,LINE,Cash,Buy 1 Get 1,Student Deal,Trang City,4.1
T0536,2026-05-30,08:05,Sat,May,Morning,C0296,25,Male,New,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,27.25,37.75,58.1%,LINE,Card,None,None,Huai Yot,4.5
T0537,2026-04-25,09:50,Sat,Apr,Morning,C0309,36,Female,VIP,No,Americano,Coffee,3,65.00,195.00,19.50,175.50,66.00,109.50,62.4%,Store,QR,10% Discount,Payday,Kantang,4.4
T0538,2026-05-17,12:15,Sun,May,Lunch,C0052,26,Male,VIP,No,French Fries,Snack,1,69.00,69.00,0.00,69.00,34.45,34.55,50.1%,LINE,QR,None,None,Trang City,3.9
T0539,2026-04-16,15:25,Thu,Apr,Afternoon,C0178,45,Male,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,27.25,37.75,58.1%,LINE,QR,None,None,Trang City,3.6
T0540,2026-03-29,18:05,Sun,Mar,Evening,C0148,22,Other,New,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,48.30,36.70,43.2%,Grab,QR,None,None,Huai Yot,3.4
T0541,2026-03-21,19:20,Sat,Mar,Evening,C0314,19,Female,New,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,31.75,43.25,57.7%,LINE,Card,None,None,Trang City,5.0
T0542,2026-05-09,20:35,Sat,May,Evening,C0088,40,Male,Returning,Yes,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,28.50,41.50,59.3%,LINE,QR,None,None,Trang City,4.2
T0543,2026-05-25,12:35,Mon,May,Lunch,C0305,34,Female,Returning,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,49.45,39.55,44.4%,LINE,QR,None,None,Huai Yot,4.3
T0544,2026-06-20,18:00,Sat,Jun,Evening,C0007,20,Female,New,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,48.30,36.70,43.2%,Grab,Card,None,None,Huai Yot,5.0
T0545,2026-01-21,16:30,Wed,Jan,Afternoon,C0082,21,Male,New,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,32.00,53.00,62.4%,Store,QR,None,None,Trang City,4.1
T0546,2026-04-07,18:40,Tue,Apr,Evening,C0242,24,Female,Returning,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,25.00,45.00,64.3%,Store,QR,None,None,Trang City,3.8
T0547,2026-04-10,16:05,Fri,Apr,Afternoon,C0250,21,Male,Returning,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,37.60,32.40,46.3%,Grab,QR,None,None,Huai Yot,4.4
T0548,2026-06-25,11:20,Thu,Jun,Lunch,C0066,39,Female,VIP,Yes,Thai Tea,Tea,1,65.00,65.00,6.50,58.50,24.00,34.50,59.0%,Store,QR,10% Discount,Payday,Kantang,4.4
T0549,2026-05-24,08:50,Sun,May,Morning,C0100,39,Female,VIP,No,Matcha Latte,Tea,2,85.00,170.00,0.00,170.00,64.00,106.00,62.4%,Store,QR,None,None,Trang City,4.5
T0550,2026-03-19,15:10,Thu,Mar,Afternoon,C0178,22,Male,New,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,QR,None,None,Trang City,4.4
T0551,2026-02-14,14:45,Sat,Feb,Afternoon,C0101,24,Male,VIP,Yes,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,47.50,27.50,36.7%,ShopeeFood,QR,None,None,Trang City,4.6
T0552,2026-04-20,16:45,Mon,Apr,Afternoon,C0200,55,Female,Returning,Yes,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,Grab,QR,None,None,Trang City,4.2
T0553,2026-01-11,18:35,Sun,Jan,Evening,C0266,34,Female,Returning,Yes,French Fries,Snack,2,69.00,138.00,0.00,138.00,62.00,76.00,55.1%,Store,Card,None,None,Trang City,3.9
T0554,2026-06-19,20:05,Fri,Jun,Evening,C0119,20,Female,New,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,35.70,29.30,45.1%,Grab,Cash,None,None,Trang City,4.3
T0555,2026-01-31,14:50,Sat,Jan,Afternoon,C0103,30,Male,Returning,No,Butter Croissant,Bakery,2,55.00,110.00,16.50,93.50,50.00,43.50,46.5%,Store,QR,Combo 15%,Weekend Boost,Trang City,3.9
T0556,2026-01-27,11:55,Tue,Jan,Lunch,C0032,27,Male,Returning,Yes,Peach Tea,Tea,1,70.00,70.00,7.00,63.00,25.00,38.00,60.3%,Store,Card,10% Discount,Payday,Trang City,4.3
T0557,2026-05-14,20:20,Thu,May,Evening,C0056,20,Other,Returning,No,Caramel Macchiato,Coffee,2,85.00,170.00,17.00,153.00,93.54,59.46,38.9%,Grab,QR,10% Discount,Student Deal,Trang City,4.7
T0558,2026-06-17,21:50,Wed,Jun,Evening,C0093,23,Female,Returning,Yes,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,37.60,32.40,46.3%,ShopeeFood,Card,None,None,Huai Yot,4.1
T0559,2026-02-28,17:45,Sat,Feb,Afternoon,C0011,19,Male,Returning,Yes,Butter Croissant,Bakery,2,55.00,110.00,0.00,110.00,69.80,40.20,36.6%,Grab,QR,None,None,Trang City,4.2
T0560,2026-04-13,21:05,Mon,Apr,Evening,C0198,20,Female,New,No,Matcha Latte,Tea,1,85.00,85.00,38.25,46.75,66.34,-19.59,-41.9%,LINE,QR,Buy 1 Get 1,Student Deal,Kantang,4.3
T0561,2026-05-11,16:15,Mon,May,Afternoon,C0085,21,Female,Returning,No,Americano,Coffee,2,65.00,130.00,0.00,130.00,67.40,62.60,48.2%,ShopeeFood,QR,None,None,Huai Yot,3.7
T0562,2026-05-21,17:10,Thu,May,Afternoon,C0223,39,Male,Returning,No,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,25.00,30.00,54.6%,Store,QR,None,None,Huai Yot,4.7
T0563,2026-01-19,20:25,Mon,Jan,Evening,C0295,19,Female,New,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,Grab,Card,None,None,Trang City,4.3
T0564,2026-03-05,14:55,Thu,Mar,Afternoon,C0334,18,Male,New,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,37.25,47.75,56.2%,LINE,QR,None,None,Trang City,4.0
T0565,2026-05-22,19:05,Fri,May,Evening,C0149,19,Female,New,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,37.60,32.40,46.3%,ShopeeFood,Card,None,None,Trang City,4.2
T0566,2026-02-11,10:50,Wed,Feb,Morning,C0227,28,Male,VIP,Yes,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,63.50,86.50,57.7%,LINE,Cash,None,None,Trang City,4.1
T0567,2026-04-22,17:15,Wed,Apr,Afternoon,C0091,22,Male,Returning,Yes,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,32.00,53.00,62.4%,Store,QR,None,None,Trang City,4.6
T0568,2026-02-20,12:15,Fri,Feb,Lunch,C0275,23,Female,New,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,33.70,31.30,48.2%,Grab,QR,None,None,Kantang,4.7
T0569,2026-04-18,20:30,Sat,Apr,Evening,C0054,21,Female,Returning,No,Butter Croissant,Bakery,2,55.00,110.00,22.00,88.00,90.84,-2.84,-3.2%,ShopeeFood,QR,Buy 1 Get 1,Student Deal,Huai Yot,4.1
T0570,2026-03-13,20:05,Fri,Mar,Evening,C0112,21,Female,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,6.50,58.50,26.93,31.57,54.0%,LINE,Card,10% Discount,Student Deal,Trang City,4.2
T0571,2026-03-15,15:25,Sun,Mar,Afternoon,C0132,23,Female,Returning,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,28.50,41.50,59.3%,LINE,Cash,None,None,Trang City,4.3
T0572,2026-03-27,19:30,Fri,Mar,Evening,C0357,19,Female,Returning,No,French Fries,Snack,1,69.00,69.00,31.05,37.95,63.90,-25.95,-68.4%,LINE,QR,Buy 1 Get 1,Student Deal,Trang City,4.3
T0573,2026-05-12,17:35,Tue,May,Afternoon,C0177,22,Male,New,No,Peach Tea,Tea,3,70.00,210.00,0.00,210.00,112.80,97.20,46.3%,ShopeeFood,QR,None,None,Trang City,3.6
T0574,2026-01-15,21:15,Thu,Jan,Evening,C0311,20,Male,Returning,Yes,French Fries,Snack,1,69.00,69.00,6.90,62.10,31.00,31.10,50.1%,Store,QR,10% Discount,Student Deal,Trang City,4.3
T0575,2026-06-13,18:25,Sat,Jun,Evening,C0314,20,Female,Returning,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,48.30,36.70,43.2%,ShopeeFood,Cash,None,None,Trang City,4.2
T0576,2026-05-23,12:30,Sat,May,Lunch,C0070,27,Male,VIP,No,Ham Cheese Sandwich,Snack,2,89.00,178.00,26.70,151.30,90.00,61.30,40.5%,Store,Card,Combo 15%,Member Exclusive,Trang City,4.4
T0577,2026-03-22,17:45,Sun,Mar,Afternoon,C0229,20,Male,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,35.70,29.30,45.1%,Grab,Cash,None,None,Kantang,4.4
T0578,2026-05-15,12:10,Fri,May,Lunch,C0214,27,Male,Returning,Yes,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,25.00,45.00,64.3%,Store,Cash,None,None,Trang City,4.1
T0579,2026-06-04,17:35,Thu,Jun,Afternoon,C0099,49,Female,New,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,25.25,39.75,61.2%,LINE,Card,None,None,Trang City,4.7
T0580,2026-02-03,18:15,Tue,Feb,Evening,C0233,23,Female,Returning,Yes,Caramel Macchiato,Coffee,1,85.00,85.00,38.25,46.75,74.41,-27.66,-59.2%,Grab,Card,Buy 1 Get 1,Student Deal,Huai Yot,4.1
T0581,2026-06-20,17:30,Sat,Jun,Afternoon,C0303,40,Male,Returning,Yes,Peach Tea,Tea,2,70.00,140.00,0.00,140.00,75.20,64.80,46.3%,Grab,QR,None,None,Trang City,4.0
T0582,2026-04-18,17:45,Sat,Apr,Afternoon,C0066,24,Female,VIP,No,Caramel Macchiato,Coffee,1,85.00,85.00,12.75,72.25,46.00,26.25,36.3%,ShopeeFood,QR,Combo 15%,Member Exclusive,Trang City,4.2
T0583,2026-05-15,16:00,Fri,May,Afternoon,C0227,33,Female,New,No,French Fries,Snack,2,69.00,138.00,0.00,138.00,62.00,76.00,55.1%,Store,QR,None,None,Huai Yot,3.8
T0584,2026-01-15,20:25,Thu,Jan,Evening,C0280,45,Male,Returning,Yes,French Fries,Snack,1,69.00,69.00,0.00,69.00,43.42,25.58,37.1%,Grab,Card,None,None,Trang City,4.9
T0585,2026-06-17,21:55,Wed,Jun,Evening,C0158,24,Male,VIP,Yes,Butter Croissant,Bakery,2,55.00,110.00,16.50,93.50,66.83,26.67,28.5%,Grab,QR,Combo 15%,Member Exclusive,Huai Yot,4.4
T0586,2026-03-19,20:55,Thu,Mar,Evening,C0055,18,Female,Returning,Yes,Matcha Latte,Tea,1,85.00,85.00,8.50,76.50,35.83,40.67,53.2%,LINE,Card,10% Discount,Student Deal,Trang City,4.0
T0587,2026-06-15,17:20,Mon,Jun,Afternoon,C0225,18,Female,Returning,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,25.25,39.75,61.2%,LINE,QR,None,None,Trang City,4.0
T0588,2026-05-19,18:40,Tue,May,Evening,C0206,32,Female,Returning,No,Peach Tea,Tea,2,70.00,140.00,0.00,140.00,50.00,90.00,64.3%,Store,QR,None,None,Trang City,4.2
T0589,2026-03-17,17:30,Tue,Mar,Afternoon,C0042,22,Female,Returning,No,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,56.00,94.00,62.7%,Store,QR,None,None,Huai Yot,4.3
T0590,2026-03-24,18:40,Tue,Mar,Evening,C0024,23,Female,New,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,27.25,37.75,58.1%,LINE,Card,None,None,Trang City,4.4
T0591,2026-06-11,19:20,Thu,Jun,Evening,C0341,18,Female,New,No,Peach Tea,Tea,2,70.00,140.00,0.00,140.00,57.00,83.00,59.3%,LINE,Card,None,None,Kantang,4.7
T0592,2026-01-16,13:45,Fri,Jan,Lunch,C0306,26,Female,VIP,No,Peach Tea,Tea,2,70.00,140.00,0.00,140.00,75.20,64.80,46.3%,Grab,QR,None,None,Trang City,4.5
T0593,2026-06-07,12:30,Sun,Jun,Lunch,C0038,31,Male,Returning,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,33.70,31.30,48.2%,Grab,QR,None,None,Huai Yot,4.4
T0594,2026-05-04,20:50,Mon,May,Evening,C0338,18,Male,Returning,No,Matcha Latte,Tea,1,85.00,85.00,38.25,46.75,66.34,-19.59,-41.9%,LINE,QR,Buy 1 Get 1,Student Deal,Kantang,4.4
T0595,2026-06-08,12:15,Mon,Jun,Lunch,C0052,20,Female,VIP,Yes,Americano,Coffee,1,65.00,65.00,0.00,65.00,33.70,31.30,48.2%,Grab,QR,None,None,Trang City,3.9
T0596,2026-01-30,20:05,Fri,Jan,Evening,C0273,24,Female,Returning,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,Grab,QR,None,None,Kantang,4.0
T0597,2026-04-12,20:30,Sun,Apr,Evening,C0344,23,Male,Returning,Yes,Matcha Latte,Tea,1,85.00,85.00,38.25,46.75,72.41,-25.66,-54.9%,ShopeeFood,QR,Buy 1 Get 1,Student Deal,Huai Yot,4.0
T0598,2026-06-08,12:15,Mon,Jun,Lunch,C0015,18,Female,Returning,Yes,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,83.00,67.00,44.7%,Grab,QR,None,None,Huai Yot,4.3
T0599,2026-05-03,09:35,Sun,May,Morning,C0015,36,Male,Returning,No,Thai Tea,Tea,2,65.00,130.00,0.00,130.00,71.40,58.60,45.1%,Grab,QR,None,None,Huai Yot,4.4
T0600,2026-05-28,18:40,Thu,May,Evening,C0286,21,Male,New,No,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,83.00,67.00,44.7%,Grab,QR,None,None,Trang City,4.4
T0601,2026-05-30,17:25,Sat,May,Afternoon,C0233,22,Male,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,31.75,43.25,57.7%,LINE,QR,None,None,Huai Yot,4.1
T0602,2026-06-01,09:00,Mon,Jun,Morning,C0254,22,Female,New,No,Thai Tea,Tea,3,65.00,195.00,0.00,195.00,107.10,87.90,45.1%,Grab,QR,None,None,Trang City,3.3
T0603,2026-05-03,12:50,Sun,May,Lunch,C0116,38,Male,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,9.75,55.25,24.00,31.25,56.6%,Store,QR,Combo 15%,Weekend Boost,Trang City,4.6
T0604,2026-04-18,20:00,Sat,Apr,Evening,C0085,22,Female,Returning,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,22.00,43.00,66.2%,Store,QR,None,None,Trang City,4.2
T0605,2026-05-24,14:00,Sun,May,Afternoon,C0052,25,Female,Returning,Yes,Matcha Latte,Tea,3,85.00,255.00,0.00,255.00,141.90,113.10,44.4%,Grab,QR,None,None,Trang City,4.6
T0606,2026-06-30,19:50,Tue,Jun,Evening,C0045,23,Female,VIP,Yes,Iced Latte,Coffee,2,75.00,150.00,22.50,127.50,78.95,48.55,38.1%,Grab,QR,Combo 15%,Member Exclusive,Trang City,4.3
T0607,2026-02-03,12:55,Tue,Feb,Lunch,C0319,48,Female,Returning,Yes,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,32.00,53.00,62.4%,Store,QR,None,None,Trang City,4.6
T0608,2026-04-09,18:50,Thu,Apr,Evening,C0308,18,Male,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,34.90,20.10,36.6%,Grab,QR,None,None,Trang City,4.3
T0609,2026-03-01,20:35,Sun,Mar,Evening,C0254,22,Male,VIP,No,Chocolate Cake,Bakery,2,75.00,150.00,0.00,150.00,95.00,55.00,36.7%,ShopeeFood,QR,None,None,Trang City,3.6
T0610,2026-05-07,21:55,Thu,May,Evening,C0084,20,Female,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,29.25,35.75,54.43,-18.68,-52.3%,ShopeeFood,Card,Buy 1 Get 1,Student Deal,Trang City,4.0
T0611,2026-04-18,19:35,Sat,Apr,Evening,C0024,22,Female,Returning,Yes,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,Grab,QR,None,None,Trang City,4.0
T0612,2026-01-18,10:30,Sun,Jan,Morning,C0327,29,Male,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,9.75,55.25,24.00,31.25,56.6%,Store,Card,Combo 15%,Weekend Boost,Trang City,4.3
T0613,2026-01-30,08:35,Fri,Jan,Morning,C0222,29,Female,Returning,No,Caramel Macchiato,Coffee,1,85.00,85.00,8.50,76.50,33.00,43.50,56.9%,Store,QR,10% Discount,Payday,Trang City,4.3
T0614,2026-03-03,21:25,Tue,Mar,Evening,C0286,22,Male,New,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,28.50,41.50,59.3%,LINE,Cash,None,None,Kantang,4.3
T0615,2026-05-22,12:15,Fri,May,Lunch,C0072,34,Female,VIP,No,Americano,Coffee,2,65.00,130.00,19.50,110.50,44.00,66.50,60.2%,Store,QR,Combo 15%,Member Exclusive,Trang City,4.2
T0616,2026-06-21,21:45,Sun,Jun,Evening,C0295,21,Female,Returning,No,Americano,Coffee,2,65.00,130.00,0.00,130.00,67.40,62.60,48.2%,Grab,QR,None,None,Trang City,4.2
T0617,2026-05-04,12:40,Mon,May,Lunch,C0073,53,Female,VIP,Yes,Americano,Coffee,1,65.00,65.00,9.75,55.25,22.00,33.25,60.2%,Store,Card,Combo 15%,Member Exclusive,Huai Yot,3.6
T0618,2026-05-06,18:30,Wed,May,Evening,C0185,22,Male,New,No,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,47.50,27.50,36.7%,Grab,QR,None,None,Trang City,4.1
T0619,2026-03-23,20:35,Mon,Mar,Evening,C0080,24,Male,Returning,Yes,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,48.30,36.70,43.2%,Grab,QR,None,None,Trang City,4.2
T0620,2026-03-10,10:35,Tue,Mar,Morning,C0097,34,Female,VIP,Yes,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,Grab,Cash,None,None,Kantang,4.2
T0621,2026-05-11,21:50,Mon,May,Evening,C0252,18,Female,Returning,Yes,Caramel Macchiato,Coffee,1,85.00,85.00,38.25,46.75,74.41,-27.66,-59.2%,ShopeeFood,Card,Buy 1 Get 1,Student Deal,Huai Yot,4.3
T0622,2026-06-23,13:20,Tue,Jun,Lunch,C0086,24,Female,New,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,Grab,QR,None,None,Trang City,3.7
T0623,2026-01-20,11:55,Tue,Jan,Lunch,C0131,53,Female,VIP,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,35.70,29.30,45.1%,Grab,Card,None,None,Kantang,4.2
T0624,2026-01-23,11:40,Fri,Jan,Lunch,C0023,29,Female,Returning,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,ShopeeFood,Card,None,None,Trang City,4.2
T0625,2026-05-06,18:50,Wed,May,Evening,C0108,32,Female,New,No,Caramel Macchiato,Coffee,2,85.00,170.00,0.00,170.00,66.00,104.00,61.2%,Store,QR,None,None,Kantang,4.5
T0626,2026-03-07,15:10,Sat,Mar,Afternoon,C0227,44,Female,VIP,No,Caramel Macchiato,Coffee,1,85.00,85.00,12.75,72.25,33.00,39.25,54.3%,Store,Card,Combo 15%,Member Exclusive,Kantang,3.7
T0627,2026-02-02,09:50,Mon,Feb,Morning,C0356,24,Female,Returning,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,61.02,27.98,31.4%,Grab,Cash,None,None,Kantang,3.7
T0628,2026-05-03,18:40,Sun,May,Evening,C0195,20,Female,Returning,No,Americano,Coffee,2,65.00,130.00,0.00,130.00,67.40,62.60,48.2%,ShopeeFood,QR,None,None,Trang City,4.2
T0629,2026-02-01,21:00,Sun,Feb,Evening,C0002,18,Male,New,No,Americano,Coffee,1,65.00,65.00,29.25,35.75,50.43,-14.68,-41.1%,Grab,Card,Buy 1 Get 1,Student Deal,Trang City,4.4
T0630,2026-05-09,19:20,Sat,May,Evening,C0282,38,Female,Returning,Yes,Americano,Coffee,1,65.00,65.00,0.00,65.00,25.25,39.75,61.2%,LINE,Card,None,None,Huai Yot,4.2
T0631,2026-03-04,12:15,Wed,Mar,Lunch,C0089,20,Male,Returning,Yes,Butter Croissant,Bakery,2,55.00,110.00,0.00,110.00,50.00,60.00,54.6%,Store,QR,None,None,Trang City,4.1
T0632,2026-01-09,11:00,Fri,Jan,Lunch,C0094,28,Female,VIP,Yes,Caramel Macchiato,Coffee,2,85.00,170.00,25.50,144.50,73.23,71.27,49.3%,LINE,Card,Combo 15%,Member Exclusive,Trang City,4.5
T0633,2026-04-22,09:10,Wed,Apr,Morning,C0113,32,Male,Returning,Yes,Matcha Latte,Tea,2,85.00,170.00,0.00,170.00,94.60,75.40,44.4%,ShopeeFood,QR,None,None,Trang City,4.1
T0634,2026-05-10,10:30,Sun,May,Morning,C0103,23,Male,Returning,Yes,Caramel Macchiato,Coffee,1,85.00,85.00,12.75,72.25,46.00,26.25,36.3%,Grab,QR,Combo 15%,Weekend Boost,Trang City,3.5
T0635,2026-06-17,13:00,Wed,Jun,Lunch,C0287,34,Female,Returning,Yes,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,47.50,27.50,36.7%,Grab,Cash,None,None,Huai Yot,3.8
T0636,2026-01-15,14:20,Thu,Jan,Afternoon,C0063,21,Male,Returning,Yes,Chocolate Cake,Bakery,2,75.00,150.00,0.00,150.00,95.00,55.00,36.7%,Grab,QR,None,None,Trang City,4.3
T0637,2026-03-28,18:15,Sat,Mar,Evening,C0201,45,Female,New,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,22.00,43.00,66.2%,Store,QR,None,None,Trang City,3.4
T0638,2026-02-06,20:25,Fri,Feb,Evening,C0024,18,Female,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,8.90,80.10,59.42,20.68,25.8%,Grab,Card,10% Discount,Student Deal,Trang City,4.4
T0639,2026-02-22,19:50,Sun,Feb,Evening,C0163,18,Female,Returning,Yes,Peach Tea,Tea,1,70.00,70.00,7.00,63.00,36.34,26.66,42.3%,Grab,Cash,10% Discount,Student Deal,Trang City,4.5
T0640,2026-04-04,12:10,Sat,Apr,Lunch,C0248,34,Female,VIP,Yes,Ham Cheese Sandwich,Snack,3,89.00,267.00,40.05,226.95,135.00,91.95,40.5%,Store,QR,Combo 15%,Weekend Boost,Huai Yot,3.9
T0641,2026-04-14,19:50,Tue,Apr,Evening,C0251,24,Female,New,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,32.00,53.00,62.4%,Store,QR,None,None,Trang City,4.5
T0642,2026-04-06,09:40,Mon,Apr,Morning,C0172,31,Male,New,No,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,63.50,86.50,57.7%,LINE,Card,None,None,Kantang,4.4
T0643,2026-04-03,12:40,Fri,Apr,Lunch,C0278,34,Male,VIP,No,Iced Latte,Coffee,2,75.00,150.00,22.50,127.50,78.95,48.55,38.1%,ShopeeFood,Cash,Combo 15%,Member Exclusive,Trang City,3.4
T0644,2026-01-31,15:05,Sat,Jan,Afternoon,C0029,19,Male,Returning,Yes,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,56.00,94.00,62.7%,Store,QR,None,None,Trang City,3.7
T0645,2026-04-18,18:40,Sat,Apr,Evening,C0084,40,Female,New,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,25.00,45.00,64.3%,Store,Card,None,None,Trang City,4.3
T0646,2026-04-13,14:30,Mon,Apr,Afternoon,C0210,40,Female,VIP,Yes,Iced Latte,Coffee,3,75.00,225.00,33.75,191.25,84.00,107.25,56.1%,Store,Card,Combo 15%,Member Exclusive,Trang City,4.3
T0647,2026-01-09,20:15,Fri,Jan,Evening,C0059,19,Male,VIP,Yes,Thai Tea,Tea,1,65.00,65.00,9.75,55.25,33.95,21.30,38.6%,Grab,QR,Combo 15%,Member Exclusive,Trang City,4.3
T0648,2026-03-19,19:20,Thu,Mar,Evening,C0323,18,Female,Returning,Yes,Caramel Macchiato,Coffee,2,85.00,170.00,17.00,153.00,93.54,59.46,38.9%,Grab,QR,10% Discount,Student Deal,Trang City,3.9
T0649,2026-05-05,12:35,Tue,May,Lunch,C0166,50,Male,Returning,Yes,French Fries,Snack,1,69.00,69.00,0.00,69.00,43.42,25.58,37.1%,Grab,Card,None,None,Huai Yot,4.0
T0650,2026-01-29,21:10,Thu,Jan,Evening,C0294,20,Female,VIP,Yes,French Fries,Snack,2,69.00,138.00,13.80,124.20,68.21,55.99,45.1%,LINE,QR,10% Discount,Student Deal,Trang City,4.9
T0651,2026-05-19,10:00,Tue,May,Morning,C0263,30,Male,VIP,Yes,Americano,Coffee,1,65.00,65.00,9.75,55.25,22.00,33.25,60.2%,Store,QR,Combo 15%,Member Exclusive,Trang City,3.9
T0652,2026-05-02,17:05,Sat,May,Afternoon,C0268,22,Female,New,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,37.60,32.40,46.3%,Grab,QR,None,None,Trang City,3.7
T0653,2026-02-13,12:10,Fri,Feb,Lunch,C0168,25,Female,Returning,No,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,34.00,41.00,54.7%,Store,Cash,None,None,Kantang,4.9
T0654,2026-03-21,15:25,Sat,Mar,Afternoon,C0205,26,Male,New,No,Butter Croissant,Bakery,1,55.00,55.00,8.25,46.75,25.00,21.75,46.5%,Store,QR,Combo 15%,Weekend Boost,Kantang,4.0
T0655,2026-05-21,12:05,Thu,May,Lunch,C0237,24,Female,Returning,Yes,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,48.30,36.70,43.2%,Grab,QR,None,None,Trang City,4.4
T0656,2026-06-20,19:55,Sat,Jun,Evening,C0055,18,Female,Returning,Yes,Matcha Latte,Tea,1,85.00,85.00,12.75,72.25,45.00,27.25,37.7%,Grab,QR,Combo 15%,Weekend Boost,Trang City,4.0
T0657,2026-02-10,11:45,Tue,Feb,Lunch,C0335,43,Female,Returning,Yes,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,83.00,67.00,44.7%,ShopeeFood,QR,None,None,Trang City,4.1
T0658,2026-01-07,14:45,Wed,Jan,Afternoon,C0048,27,Female,Returning,Yes,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,25.00,45.00,64.3%,Store,Card,None,None,Trang City,4.3
T0659,2026-03-27,10:55,Fri,Mar,Morning,C0280,33,Male,New,No,Thai Tea,Tea,2,65.00,130.00,13.00,117.00,69.06,47.94,41.0%,Grab,QR,10% Discount,Payday,Huai Yot,4.2
T0660,2026-01-16,14:00,Fri,Jan,Afternoon,C0020,20,Male,New,No,Thai Tea,Tea,2,65.00,130.00,0.00,130.00,71.40,58.60,45.1%,Grab,QR,None,None,Trang City,4.3
T0661,2026-05-06,14:15,Wed,May,Afternoon,C0038,45,Male,New,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,61.02,27.98,31.4%,ShopeeFood,QR,None,None,Trang City,4.0
T0662,2026-02-15,15:45,Sun,Feb,Afternoon,C0090,32,Female,Returning,Yes,French Fries,Snack,2,69.00,138.00,0.00,138.00,68.90,69.10,50.1%,LINE,QR,None,None,Kantang,4.1
T0663,2026-02-28,15:40,Sat,Feb,Afternoon,C0333,47,Female,Returning,Yes,Butter Croissant,Bakery,2,55.00,110.00,11.00,99.00,50.00,49.00,49.5%,Store,Card,10% Discount,Payday,Trang City,3.9
T0664,2026-03-28,11:00,Sat,Mar,Lunch,C0143,29,Female,Returning,Yes,Americano,Coffee,1,65.00,65.00,9.75,55.25,22.00,33.25,60.2%,Store,QR,Combo 15%,Weekend Boost,Trang City,3.9
T0665,2026-01-09,19:20,Fri,Jan,Evening,C0251,24,Female,New,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,36.25,48.75,57.4%,LINE,QR,None,None,Trang City,3.6
T0666,2026-04-19,21:00,Sun,Apr,Evening,C0136,23,Male,New,No,Peach Tea,Tea,1,70.00,70.00,31.50,38.50,56.93,-18.43,-47.9%,Grab,QR,Buy 1 Get 1,Student Deal,Kantang,4.2
T0667,2026-02-23,16:15,Mon,Feb,Afternoon,C0185,20,Male,Returning,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,48.30,36.70,43.2%,Grab,Cash,None,None,Trang City,4.0
T0668,2026-01-30,10:35,Fri,Jan,Morning,C0295,31,Other,Returning,No,Caramel Macchiato,Coffee,1,85.00,85.00,8.50,76.50,33.00,43.50,56.9%,Store,QR,10% Discount,Payday,Trang City,4.4
T0669,2026-02-06,12:20,Fri,Feb,Lunch,C0188,19,Female,Returning,Yes,Matcha Latte,Tea,2,85.00,170.00,0.00,170.00,94.60,75.40,44.4%,Grab,Card,None,None,Trang City,4.5
T0670,2026-01-10,10:00,Sat,Jan,Morning,C0123,25,Female,New,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,35.70,29.30,45.1%,Grab,QR,None,None,Trang City,4.2
T0671,2026-04-19,19:25,Sun,Apr,Evening,C0225,32,Male,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,27.75,27.25,49.6%,LINE,QR,None,None,Trang City,4.2
T0672,2026-05-08,11:10,Fri,May,Lunch,C0132,18,Male,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,Grab,Cash,None,None,Trang City,4.4
T0673,2026-04-23,15:00,Thu,Apr,Afternoon,C0062,26,Female,Returning,No,French Fries,Snack,1,69.00,69.00,0.00,69.00,43.42,25.58,37.1%,ShopeeFood,QR,None,None,Trang City,4.8
T0674,2026-03-12,08:20,Thu,Mar,Morning,C0104,31,Female,Returning,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,61.02,27.98,31.4%,Grab,QR,None,None,Trang City,4.9
T0675,2026-05-09,11:20,Sat,May,Lunch,C0358,51,Female,New,No,Americano,Coffee,2,65.00,130.00,19.50,110.50,63.89,46.61,42.2%,ShopeeFood,Cash,Combo 15%,Weekend Boost,Huai Yot,4.1
T0676,2026-02-17,11:35,Tue,Feb,Lunch,C0088,20,Female,Returning,Yes,Americano,Coffee,2,65.00,130.00,0.00,130.00,67.40,62.60,48.2%,ShopeeFood,QR,None,None,Trang City,3.9
T0677,2026-05-13,08:40,Wed,May,Morning,C0227,30,Male,VIP,Yes,Ham Cheese Sandwich,Snack,2,89.00,178.00,0.00,178.00,98.90,79.10,44.4%,LINE,QR,None,None,Huai Yot,5.0
T0678,2026-06-08,13:00,Mon,Jun,Lunch,C0146,18,Female,Returning,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,25.25,39.75,61.2%,LINE,Cash,None,None,Kantang,4.6
T0679,2026-05-22,20:05,Fri,May,Evening,C0264,19,Female,New,No,Americano,Coffee,2,65.00,130.00,13.00,117.00,65.06,51.94,44.4%,Grab,QR,10% Discount,Student Deal,Huai Yot,4.5
T0680,2026-04-05,14:55,Sun,Apr,Afternoon,C0119,24,Female,Returning,Yes,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,47.50,27.50,36.7%,Grab,Card,None,None,Trang City,4.2
T0681,2026-06-28,21:15,Sun,Jun,Evening,C0078,19,Male,Returning,Yes,French Fries,Snack,1,69.00,69.00,0.00,69.00,43.42,25.58,37.1%,Grab,Cash,None,None,Trang City,4.1
T0682,2026-05-17,14:30,Sun,May,Afternoon,C0102,20,Female,New,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,33.70,31.30,48.2%,Grab,Card,None,None,Trang City,4.5
T0683,2026-06-10,20:55,Wed,Jun,Evening,C0355,23,Male,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,35.70,29.30,45.1%,ShopeeFood,QR,None,None,Kantang,3.8
T0684,2026-06-30,11:50,Tue,Jun,Lunch,C0180,21,Male,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,34.90,20.10,36.6%,Grab,QR,None,None,Trang City,4.3
T0685,2026-06-17,11:40,Wed,Jun,Lunch,C0309,22,Male,Returning,Yes,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,37.60,32.40,46.3%,Grab,Cash,None,None,Trang City,3.6
T0686,2026-05-17,19:40,Sun,May,Evening,C0307,27,Female,New,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,45.00,44.00,49.4%,Store,Card,None,None,Trang City,4.3
T0687,2026-04-09,12:45,Thu,Apr,Lunch,C0306,18,Male,New,No,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,27.75,27.25,49.6%,LINE,Card,None,None,Trang City,3.8
T0688,2026-04-15,17:45,Wed,Apr,Afternoon,C0334,31,Male,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,45.00,44.00,49.4%,Store,QR,None,None,Kantang,4.4
T0689,2026-02-10,19:15,Tue,Feb,Evening,C0155,18,Male,Returning,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,37.25,47.75,56.2%,LINE,QR,None,None,Kantang,3.8
T0690,2026-03-18,17:25,Wed,Mar,Afternoon,C0172,23,Male,VIP,Yes,Matcha Latte,Tea,2,85.00,170.00,25.50,144.50,90.01,54.49,37.7%,Grab,Card,Combo 15%,Member Exclusive,Trang City,3.7
T0691,2026-05-04,17:50,Mon,May,Afternoon,C0179,44,Female,Returning,No,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,27.75,27.25,49.6%,LINE,Card,None,None,Kantang,4.7
T0692,2026-04-26,13:10,Sun,Apr,Lunch,C0317,48,Female,Returning,No,Peach Tea,Tea,2,70.00,140.00,21.00,119.00,50.00,69.00,58.0%,Store,QR,Combo 15%,Weekend Boost,Trang City,4.3
T0693,2026-05-06,21:20,Wed,May,Evening,C0124,19,Male,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,35.70,29.30,45.1%,Grab,Card,None,None,Trang City,4.5
T0694,2026-05-26,08:10,Tue,May,Morning,C0121,24,Male,New,No,Iced Latte,Coffee,1,75.00,75.00,7.50,67.50,28.00,39.50,58.5%,Store,Card,10% Discount,Payday,Kantang,4.5
T0695,2026-02-21,18:30,Sat,Feb,Evening,C0026,18,Male,Returning,Yes,French Fries,Snack,2,69.00,138.00,0.00,138.00,68.90,69.10,50.1%,LINE,QR,None,None,Trang City,3.9
T0696,2026-01-15,20:55,Thu,Jan,Evening,C0204,18,Male,Returning,Yes,Matcha Latte,Tea,2,85.00,170.00,0.00,170.00,64.00,106.00,62.4%,Store,Card,None,None,Trang City,4.6
T0697,2026-06-26,11:45,Fri,Jun,Lunch,C0301,37,Female,Returning,No,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,37.75,37.25,49.7%,LINE,QR,None,None,Trang City,4.6
T0698,2026-05-23,13:15,Sat,May,Lunch,C0130,21,Male,New,No,Thai Tea,Tea,2,65.00,130.00,0.00,130.00,71.40,58.60,45.1%,Grab,QR,None,None,Trang City,3.9
T0699,2026-03-24,14:25,Tue,Mar,Afternoon,C0006,23,Female,New,No,Peach Tea,Tea,2,70.00,140.00,0.00,140.00,75.20,64.80,46.3%,Grab,QR,None,None,Trang City,4.2
T0700,2026-01-25,08:00,Sun,Jan,Morning,C0344,25,Female,VIP,Yes,Caramel Macchiato,Coffee,2,85.00,170.00,25.50,144.50,66.00,78.50,54.3%,Store,Cash,Combo 15%,Member Exclusive,Trang City,4.6
T0701,2026-04-12,21:05,Sun,Apr,Evening,C0254,18,Female,VIP,No,Matcha Latte,Tea,3,85.00,255.00,38.25,216.75,135.02,81.73,37.7%,ShopeeFood,QR,Combo 15%,Weekend Boost,Trang City,4.1
T0702,2026-03-09,09:15,Mon,Mar,Morning,C0187,23,Female,New,No,Butter Croissant,Bakery,2,55.00,110.00,0.00,110.00,69.80,40.20,36.6%,Grab,Card,None,None,Trang City,3.9
T0703,2026-05-28,09:15,Thu,May,Morning,C0210,39,Female,VIP,Yes,Caramel Macchiato,Coffee,2,85.00,170.00,0.00,170.00,66.00,104.00,61.2%,Store,QR,None,None,Trang City,4.6
T0704,2026-05-20,19:50,Wed,May,Evening,C0055,23,Female,New,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,QR,None,None,Trang City,4.2
T0705,2026-03-22,18:55,Sun,Mar,Evening,C0106,24,Female,New,No,Iced Latte,Coffee,2,75.00,150.00,22.50,127.50,56.00,71.50,56.1%,Store,QR,Combo 15%,Weekend Boost,Trang City,3.7
T0706,2026-06-16,14:30,Tue,Jun,Afternoon,C0278,35,Female,Returning,Yes,Chocolate Cake,Bakery,2,75.00,150.00,0.00,150.00,95.00,55.00,36.7%,Grab,QR,None,None,Huai Yot,4.4
T0707,2026-03-24,11:50,Tue,Mar,Lunch,C0052,22,Male,Returning,Yes,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,63.50,86.50,57.7%,LINE,Card,None,None,Trang City,3.9
T0708,2026-06-01,20:55,Mon,Jun,Evening,C0078,22,Male,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,24.75,30.25,50.00,-19.75,-65.3%,Store,QR,Buy 1 Get 1,Student Deal,Kantang,4.4
T0709,2026-01-11,16:05,Sun,Jan,Afternoon,C0022,41,Male,New,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,Card,None,None,Huai Yot,3.9
T0710,2026-06-02,09:50,Tue,Jun,Morning,C0346,22,Female,VIP,Yes,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,83.00,67.00,44.7%,Grab,Card,None,None,Trang City,4.2
T0711,2026-01-15,18:20,Thu,Jan,Evening,C0039,29,Female,VIP,Yes,Caramel Macchiato,Coffee,2,85.00,170.00,25.50,144.50,92.01,52.49,36.3%,Grab,QR,Combo 15%,Member Exclusive,Huai Yot,4.4
T0712,2026-02-28,16:30,Sat,Feb,Afternoon,C0252,28,Other,New,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,35.70,29.30,45.1%,ShopeeFood,QR,None,None,Trang City,3.9
T0713,2026-01-12,10:55,Mon,Jan,Morning,C0241,24,Female,Returning,Yes,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,37.60,32.40,46.3%,Grab,QR,None,None,Trang City,3.7
T0714,2026-05-15,21:45,Fri,May,Evening,C0191,23,Female,VIP,No,Chocolate Cake,Bakery,1,75.00,75.00,11.25,63.75,45.47,18.28,28.7%,Grab,QR,Combo 15%,Member Exclusive,Trang City,4.5
T0715,2026-04-20,11:55,Mon,Apr,Lunch,C0124,32,Male,VIP,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,QR,None,None,Trang City,3.9
T0716,2026-03-27,12:35,Fri,Mar,Lunch,C0353,18,Male,Returning,Yes,Chocolate Cake,Bakery,2,75.00,150.00,0.00,150.00,95.00,55.00,36.7%,ShopeeFood,QR,None,None,Kantang,4.7
T0717,2026-04-13,10:40,Mon,Apr,Morning,C0040,24,Female,New,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,48.30,36.70,43.2%,Grab,QR,None,None,Trang City,4.3
T0718,2026-03-19,20:25,Thu,Mar,Evening,C0205,21,Female,Returning,Yes,Americano,Coffee,1,65.00,65.00,29.25,35.75,45.79,-10.04,-28.1%,LINE,QR,Buy 1 Get 1,Student Deal,Trang City,3.8
T0719,2026-05-15,09:45,Fri,May,Morning,C0212,24,Female,VIP,No,Americano,Coffee,2,65.00,130.00,0.00,130.00,67.40,62.60,48.2%,Grab,Card,None,None,Trang City,4.4
T0720,2026-02-25,16:30,Wed,Feb,Afternoon,C0114,35,Female,VIP,Yes,Butter Croissant,Bakery,3,55.00,165.00,24.75,140.25,100.24,40.01,28.5%,Grab,QR,Combo 15%,Member Exclusive,Trang City,4.9
T0721,2026-02-22,14:05,Sun,Feb,Afternoon,C0058,18,Female,New,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,Grab,Card,None,None,Trang City,4.3
T0722,2026-02-02,09:20,Mon,Feb,Morning,C0046,19,Female,New,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,36.25,48.75,57.4%,LINE,QR,None,None,Trang City,3.6
T0723,2026-06-05,19:30,Fri,Jun,Evening,C0225,46,Female,New,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,61.02,27.98,31.4%,Grab,QR,None,None,Kantang,3.9
T0724,2026-03-17,16:35,Tue,Mar,Afternoon,C0228,33,Male,Returning,Yes,Americano,Coffee,1,65.00,65.00,0.00,65.00,33.70,31.30,48.2%,Grab,QR,None,None,Huai Yot,4.2
T0725,2026-05-26,13:05,Tue,May,Lunch,C0003,20,Male,New,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,27.25,37.75,58.1%,LINE,Cash,None,None,Trang City,4.2
T0726,2026-06-24,20:35,Wed,Jun,Evening,C0217,48,Male,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,49.45,39.55,44.4%,LINE,QR,None,None,Trang City,4.5
T0727,2026-06-06,13:45,Sat,Jun,Lunch,C0229,23,Male,Returning,Yes,Peach Tea,Tea,1,70.00,70.00,10.50,59.50,25.00,34.50,58.0%,Store,Card,Combo 15%,Weekend Boost,Trang City,4.6
T0728,2026-05-30,11:50,Sat,May,Lunch,C0283,19,Female,Returning,Yes,Chocolate Cake,Bakery,2,75.00,150.00,0.00,150.00,95.00,55.00,36.7%,Grab,QR,None,None,Trang City,4.5
T0729,2026-06-20,14:10,Sat,Jun,Afternoon,C0089,38,Female,VIP,Yes,Iced Latte,Coffee,1,75.00,75.00,11.25,63.75,28.00,35.75,56.1%,Store,QR,Combo 15%,Member Exclusive,Trang City,4.6
T0730,2026-05-15,14:10,Fri,May,Afternoon,C0197,37,Female,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,Grab,QR,None,None,Kantang,3.8
T0731,2026-03-28,12:15,Sat,Mar,Lunch,C0173,29,Female,Returning,No,Iced Latte,Coffee,1,75.00,75.00,7.50,67.50,28.00,39.50,58.5%,Store,QR,10% Discount,Payday,Kantang,3.7
T0732,2026-04-17,11:55,Fri,Apr,Lunch,C0094,32,Female,New,No,French Fries,Snack,1,69.00,69.00,0.00,69.00,31.00,38.00,55.1%,Store,Card,None,None,Trang City,4.2
T0733,2026-06-03,14:40,Wed,Jun,Afternoon,C0043,24,Male,VIP,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,13.35,75.65,45.00,30.65,40.5%,Store,Card,Combo 15%,Member Exclusive,Trang City,4.8
T0734,2026-06-01,10:10,Mon,Jun,Morning,C0073,23,Female,Returning,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,22.00,43.00,66.2%,Store,QR,None,None,Trang City,4.2
T0735,2026-05-22,11:25,Fri,May,Lunch,C0074,24,Female,Returning,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,33.70,31.30,48.2%,ShopeeFood,QR,None,None,Trang City,4.4
T0736,2026-04-08,15:45,Wed,Apr,Afternoon,C0167,27,Male,New,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,25.00,45.00,64.3%,Store,QR,None,None,Trang City,4.2
T0737,2026-04-03,16:20,Fri,Apr,Afternoon,C0109,24,Female,New,No,Americano,Coffee,2,65.00,130.00,0.00,130.00,44.00,86.00,66.2%,Store,Card,None,None,Kantang,4.4
T0738,2026-01-09,19:50,Fri,Jan,Evening,C0191,21,Female,Returning,Yes,Ham Cheese Sandwich,Snack,2,89.00,178.00,0.00,178.00,90.00,88.00,49.4%,Store,Cash,None,None,Trang City,4.1
T0739,2026-01-18,12:10,Sun,Jan,Lunch,C0010,35,Female,New,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,36.25,48.75,57.4%,LINE,Card,None,None,Trang City,4.6
T0740,2026-04-23,16:20,Thu,Apr,Afternoon,C0312,33,Male,Returning,Yes,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,28.50,41.50,59.3%,LINE,QR,None,None,Trang City,3.7
T0741,2026-03-01,09:50,Sun,Mar,Morning,C0113,33,Male,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,9.75,55.25,24.00,31.25,56.6%,Store,QR,Combo 15%,Weekend Boost,Kantang,4.0
T0742,2026-02-01,17:35,Sun,Feb,Afternoon,C0330,20,Female,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,31.75,43.25,57.7%,LINE,QR,None,None,Trang City,3.7
T0743,2026-06-07,13:10,Sun,Jun,Lunch,C0341,28,Female,Returning,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,31.75,43.25,57.7%,LINE,QR,None,None,Trang City,4.3
T0744,2026-01-08,12:30,Thu,Jan,Lunch,C0027,32,Female,VIP,Yes,Butter Croissant,Bakery,3,55.00,165.00,24.75,140.25,82.01,58.24,41.5%,LINE,QR,Combo 15%,Member Exclusive,Trang City,4.7
T0745,2026-05-19,10:35,Tue,May,Morning,C0106,30,Female,Returning,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,31.75,43.25,57.7%,LINE,QR,None,None,Huai Yot,4.2
T0746,2026-03-24,11:30,Tue,Mar,Lunch,C0202,27,Female,Returning,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,37.25,47.75,56.2%,LINE,Card,None,None,Huai Yot,4.3
T0747,2026-06-13,17:40,Sat,Jun,Afternoon,C0067,19,Male,New,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,32.00,53.00,62.4%,Store,Card,None,None,Huai Yot,4.6
T0748,2026-04-30,20:20,Thu,Apr,Evening,C0256,22,Male,VIP,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,Grab,QR,None,None,Huai Yot,4.2
T0749,2026-04-07,15:50,Tue,Apr,Afternoon,C0268,27,Male,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,45.00,44.00,49.4%,Store,QR,None,None,Trang City,4.3
T0750,2026-02-01,16:05,Sun,Feb,Afternoon,C0064,23,Male,Returning,Yes,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,33.00,52.00,61.2%,Store,QR,None,None,Trang City,3.9
T0751,2026-05-27,10:55,Wed,May,Morning,C0246,35,Female,Returning,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,31.75,43.25,57.7%,LINE,QR,None,None,Trang City,4.1
T0752,2026-03-18,20:55,Wed,Mar,Evening,C0115,21,Female,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,Grab,QR,None,None,Kantang,4.9
T0753,2026-06-01,20:15,Mon,Jun,Evening,C0203,18,Male,New,No,French Fries,Snack,1,69.00,69.00,6.90,62.10,42.18,19.92,32.1%,Grab,QR,10% Discount,Student Deal,Trang City,4.2
T0754,2026-04-01,18:05,Wed,Apr,Evening,C0290,20,Female,Returning,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,32.00,53.00,62.4%,Store,QR,None,None,Huai Yot,4.6
T0755,2026-05-01,14:35,Fri,May,Afternoon,C0035,21,Female,Returning,Yes,Thai Tea,Tea,2,65.00,130.00,0.00,130.00,71.40,58.60,45.1%,ShopeeFood,QR,None,None,Kantang,3.6
T0756,2026-06-07,16:55,Sun,Jun,Afternoon,C0031,18,Other,Returning,Yes,Matcha Latte,Tea,2,85.00,170.00,0.00,170.00,64.00,106.00,62.4%,Store,Card,None,None,Trang City,4.4
T0757,2026-01-08,14:45,Thu,Jan,Afternoon,C0106,32,Female,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,45.00,44.00,49.4%,Store,QR,None,None,Huai Yot,4.4
T0758,2026-01-31,21:05,Sat,Jan,Evening,C0331,21,Male,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,QR,None,None,Trang City,4.2
T0759,2026-03-16,15:35,Mon,Mar,Afternoon,C0182,24,Male,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,27.25,37.75,58.1%,LINE,Card,None,None,Trang City,4.1
T0760,2026-01-14,17:05,Wed,Jan,Afternoon,C0187,28,Male,Returning,Yes,Caramel Macchiato,Coffee,2,85.00,170.00,0.00,170.00,66.00,104.00,61.2%,Store,Card,None,None,Trang City,4.7
T0761,2026-04-15,11:20,Wed,Apr,Lunch,C0007,20,Male,New,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,25.00,45.00,64.3%,Store,QR,None,None,Trang City,4.3
T0762,2026-04-08,10:55,Wed,Apr,Morning,C0044,19,Female,New,No,Ham Cheese Sandwich,Snack,2,89.00,178.00,0.00,178.00,122.04,55.96,31.4%,Grab,QR,None,None,Trang City,4.0
T0763,2026-05-21,13:05,Thu,May,Lunch,C0145,28,Female,VIP,Yes,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,37.60,32.40,46.3%,Grab,QR,None,None,Trang City,4.6
T0764,2026-05-10,16:05,Sun,May,Afternoon,C0031,21,Male,Returning,Yes,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,25.00,45.00,64.3%,Store,Cash,None,None,Trang City,4.9
T0765,2026-01-22,15:40,Thu,Jan,Afternoon,C0030,46,Male,VIP,Yes,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,Grab,Card,None,None,Kantang,4.3
T0766,2026-01-16,19:20,Fri,Jan,Evening,C0158,23,Female,Returning,Yes,Americano,Coffee,2,65.00,130.00,0.00,130.00,44.00,86.00,66.2%,Store,Card,None,None,Trang City,4.8
T0767,2026-02-26,19:05,Thu,Feb,Evening,C0069,22,Female,Returning,Yes,Chocolate Cake,Bakery,2,75.00,150.00,15.00,135.00,92.30,42.70,31.6%,Grab,Cash,10% Discount,Payday,Huai Yot,4.3
T0768,2026-05-16,15:45,Sat,May,Afternoon,C0299,44,Male,Returning,No,Americano,Coffee,1,65.00,65.00,9.75,55.25,31.95,23.30,42.2%,Grab,QR,Combo 15%,Weekend Boost,Trang City,4.8
T0769,2026-03-16,11:20,Mon,Mar,Lunch,C0281,25,Male,Returning,No,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,34.00,41.00,54.7%,Store,QR,None,None,Trang City,4.1
T0770,2026-03-04,16:10,Wed,Mar,Afternoon,C0042,24,Male,Returning,Yes,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,47.50,27.50,36.7%,Grab,QR,None,None,Trang City,4.2
T0771,2026-02-08,16:20,Sun,Feb,Afternoon,C0201,20,Male,New,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,24.00,41.00,63.1%,Store,QR,None,None,Trang City,4.0
T0772,2026-06-10,18:25,Wed,Jun,Evening,C0179,43,Male,New,No,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,25.00,30.00,54.6%,Store,QR,None,None,Trang City,4.1
T0773,2026-06-18,15:35,Thu,Jun,Afternoon,C0083,32,Female,Returning,No,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,34.90,20.10,36.6%,Grab,QR,None,None,Trang City,4.3
T0774,2026-06-21,16:00,Sun,Jun,Afternoon,C0256,41,Male,Returning,No,French Fries,Snack,1,69.00,69.00,0.00,69.00,31.00,38.00,55.1%,Store,Card,None,None,Huai Yot,4.5
T0775,2026-06-10,13:00,Wed,Jun,Lunch,C0342,31,Male,VIP,No,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,47.50,27.50,36.7%,Grab,Card,None,None,Kantang,4.3
T0776,2026-01-20,10:05,Tue,Jan,Morning,C0186,32,Male,VIP,Yes,Iced Latte,Coffee,2,75.00,150.00,22.50,127.50,78.95,48.55,38.1%,Grab,QR,Combo 15%,Member Exclusive,Huai Yot,4.1
T0777,2026-04-05,19:00,Sun,Apr,Evening,C0284,20,Male,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,11.25,63.75,39.47,24.28,38.1%,ShopeeFood,Card,Combo 15%,Weekend Boost,Huai Yot,4.6
T0778,2026-04-14,18:00,Tue,Apr,Evening,C0188,19,Male,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,Grab,QR,None,None,Huai Yot,4.3
T0779,2026-05-25,12:35,Mon,May,Lunch,C0219,24,Female,Returning,Yes,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,28.50,41.50,59.3%,LINE,Card,None,None,Trang City,4.9
T0780,2026-03-17,19:05,Tue,Mar,Evening,C0290,24,Female,New,No,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,83.00,67.00,44.7%,Grab,QR,None,None,Trang City,4.1
T0781,2026-02-15,13:40,Sun,Feb,Lunch,C0113,41,Female,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,Card,None,None,Trang City,3.7
T0782,2026-03-20,12:50,Fri,Mar,Lunch,C0223,19,Female,New,No,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,27.75,27.25,49.6%,LINE,Card,None,None,Kantang,4.2
T0783,2026-01-13,17:50,Tue,Jan,Afternoon,C0305,26,Male,Returning,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,24.00,41.00,63.1%,Store,QR,None,None,Trang City,4.3
T0784,2026-01-13,14:00,Tue,Jan,Afternoon,C0051,38,Female,VIP,Yes,Thai Tea,Tea,2,65.00,130.00,19.50,110.50,48.00,62.50,56.6%,Store,QR,Combo 15%,Member Exclusive,Trang City,4.3
T0785,2026-05-05,08:25,Tue,May,Morning,C0340,42,Male,VIP,Yes,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,24.00,41.00,63.1%,Store,Card,None,None,Trang City,5.0
T0786,2026-01-31,18:15,Sat,Jan,Evening,C0141,19,Male,VIP,Yes,Peach Tea,Tea,2,70.00,140.00,0.00,140.00,75.20,64.80,46.3%,Grab,Card,None,None,Trang City,4.4
T0787,2026-01-13,12:55,Tue,Jan,Lunch,C0054,38,Male,VIP,No,Matcha Latte,Tea,2,85.00,170.00,0.00,170.00,64.00,106.00,62.4%,Store,QR,None,None,Trang City,3.8
T0788,2026-01-20,17:00,Tue,Jan,Afternoon,C0338,32,Male,Returning,Yes,Americano,Coffee,1,65.00,65.00,0.00,65.00,33.70,31.30,48.2%,ShopeeFood,Cash,None,None,Trang City,4.4
T0789,2026-01-29,19:30,Thu,Jan,Evening,C0070,18,Female,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,35.70,29.30,45.1%,Grab,QR,None,None,Trang City,4.7
T0790,2026-05-30,12:45,Sat,May,Lunch,C0104,29,Male,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,9.75,55.25,24.00,31.25,56.6%,Store,Card,Combo 15%,Weekend Boost,Trang City,4.0
T0791,2026-05-15,11:50,Fri,May,Lunch,C0122,34,Female,Returning,Yes,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,83.00,67.00,44.7%,ShopeeFood,QR,None,None,Trang City,4.1
T0792,2026-03-20,13:40,Fri,Mar,Lunch,C0124,20,Female,New,No,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,34.90,20.10,36.6%,Grab,Card,None,None,Trang City,3.8
T0793,2026-03-20,19:50,Fri,Mar,Evening,C0294,21,Male,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,24.75,30.25,55.44,-25.19,-83.3%,ShopeeFood,QR,Buy 1 Get 1,Student Deal,Trang City,4.6
T0794,2026-06-29,19:20,Mon,Jun,Evening,C0159,31,Female,New,No,Chocolate Cake,Bakery,3,75.00,225.00,0.00,225.00,113.25,111.75,49.7%,LINE,QR,None,None,Huai Yot,4.1
T0795,2026-02-26,12:35,Thu,Feb,Lunch,C0046,27,Male,Returning,No,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,47.50,27.50,36.7%,Grab,Card,None,None,Huai Yot,4.2
T0796,2026-04-03,12:15,Fri,Apr,Lunch,C0358,23,Male,VIP,No,Caramel Macchiato,Coffee,2,85.00,170.00,25.50,144.50,92.01,52.49,36.3%,ShopeeFood,QR,Combo 15%,Member Exclusive,Trang City,3.9
T0797,2026-04-23,20:05,Thu,Apr,Evening,C0289,24,Female,VIP,No,Thai Tea,Tea,2,65.00,130.00,19.50,110.50,67.89,42.61,38.6%,Grab,QR,Combo 15%,Member Exclusive,Trang City,4.3
T0798,2026-03-28,19:50,Sat,Mar,Evening,C0066,20,Male,Returning,Yes,Butter Croissant,Bakery,2,55.00,110.00,0.00,110.00,69.80,40.20,36.6%,Grab,QR,None,None,Trang City,4.0
T0799,2026-02-22,19:10,Sun,Feb,Evening,C0168,22,Female,Returning,Yes,Chocolate Cake,Bakery,1,75.00,75.00,33.75,41.25,75.42,-34.17,-82.8%,Grab,Cash,Buy 1 Get 1,Student Deal,Trang City,4.4
T0800,2026-05-05,19:50,Tue,May,Evening,C0299,20,Male,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,33.75,41.25,56.00,-14.75,-35.8%,Store,Card,Buy 1 Get 1,Student Deal,Trang City,4.3
T0801,2026-03-28,20:10,Sat,Mar,Evening,C0348,21,Female,New,No,French Fries,Snack,1,69.00,69.00,0.00,69.00,43.42,25.58,37.1%,Grab,QR,None,None,Trang City,4.3
T0802,2026-01-29,18:45,Thu,Jan,Evening,C0323,22,Male,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,Grab,QR,None,None,Huai Yot,4.4
T0803,2026-05-17,08:30,Sun,May,Morning,C0177,28,Male,VIP,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,13.35,75.65,45.00,30.65,40.5%,Store,QR,Combo 15%,Member Exclusive,Huai Yot,3.7
T0804,2026-01-25,21:35,Sun,Jan,Evening,C0293,23,Female,Returning,Yes,Thai Tea,Tea,3,65.00,195.00,26.00,169.00,126.42,42.58,25.2%,Grab,QR,Buy 1 Get 1,Student Deal,Trang City,4.3
T0805,2026-01-28,18:00,Wed,Jan,Evening,C0353,19,Male,Returning,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,36.25,48.75,57.4%,LINE,QR,None,None,Trang City,4.5
T0806,2026-01-03,16:55,Sat,Jan,Afternoon,C0058,42,Female,Returning,Yes,Americano,Coffee,2,65.00,130.00,19.50,110.50,63.89,46.61,42.2%,Grab,Card,Combo 15%,Weekend Boost,Trang City,3.9
T0807,2026-04-03,08:15,Fri,Apr,Morning,C0016,35,Female,New,No,French Fries,Snack,1,69.00,69.00,0.00,69.00,43.42,25.58,37.1%,ShopeeFood,QR,None,None,Huai Yot,4.0
T0808,2026-03-28,17:20,Sat,Mar,Afternoon,C0325,19,Male,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,9.75,55.25,33.95,21.30,38.6%,Grab,Card,Combo 15%,Weekend Boost,Trang City,4.5
T0809,2026-02-25,09:00,Wed,Feb,Morning,C0145,28,Male,Returning,Yes,Americano,Coffee,3,65.00,195.00,0.00,195.00,66.00,129.00,66.2%,Store,QR,None,None,Trang City,4.6
T0810,2026-06-25,16:10,Thu,Jun,Afternoon,C0266,52,Female,Returning,No,Thai Tea,Tea,1,65.00,65.00,6.50,58.50,24.00,34.50,59.0%,Store,QR,10% Discount,Payday,Kantang,4.3
T0811,2026-02-19,08:40,Thu,Feb,Morning,C0321,29,Female,New,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,35.70,29.30,45.1%,Grab,QR,None,None,Trang City,4.3
T0812,2026-06-21,20:35,Sun,Jun,Evening,C0223,21,Female,Returning,Yes,Thai Tea,Tea,2,65.00,130.00,0.00,130.00,54.50,75.50,58.1%,LINE,Card,None,None,Trang City,4.4
T0813,2026-01-09,10:45,Fri,Jan,Morning,C0266,18,Male,New,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,Grab,Card,None,None,Trang City,4.0
T0814,2026-03-02,19:15,Mon,Mar,Evening,C0305,19,Female,Returning,No,Thai Tea,Tea,1,65.00,65.00,29.25,35.75,54.43,-18.68,-52.3%,Grab,QR,Buy 1 Get 1,Student Deal,Huai Yot,4.1
T0815,2026-01-06,16:45,Tue,Jan,Afternoon,C0317,29,Male,New,No,Peach Tea,Tea,2,70.00,140.00,0.00,140.00,57.00,83.00,59.3%,LINE,QR,None,None,Trang City,3.9
T0816,2026-04-29,18:30,Wed,Apr,Evening,C0184,24,Male,New,No,Thai Tea,Tea,1,65.00,65.00,6.50,58.50,26.93,31.57,54.0%,LINE,QR,10% Discount,Student Deal,Trang City,4.3
T0817,2026-04-04,21:55,Sat,Apr,Evening,C0089,21,Female,VIP,Yes,Thai Tea,Tea,2,65.00,130.00,13.00,117.00,48.00,69.00,59.0%,Store,QR,10% Discount,Student Deal,Kantang,4.7
T0818,2026-01-20,08:05,Tue,Jan,Morning,C0218,20,Male,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,Grab,Card,None,None,Kantang,3.8
T0819,2026-02-10,15:00,Tue,Feb,Afternoon,C0019,36,Female,New,No,French Fries,Snack,3,69.00,207.00,0.00,207.00,103.35,103.65,50.1%,LINE,QR,None,None,Trang City,4.4
T0820,2026-04-15,16:00,Wed,Apr,Afternoon,C0020,24,Female,Returning,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,33.00,52.00,61.2%,Store,Card,None,None,Huai Yot,4.4
T0821,2026-03-17,13:10,Tue,Mar,Lunch,C0162,40,Male,New,No,Butter Croissant,Bakery,2,55.00,110.00,0.00,110.00,55.50,54.50,49.6%,LINE,QR,None,None,Trang City,4.0
T0822,2026-04-24,19:25,Fri,Apr,Evening,C0210,19,Male,New,No,Matcha Latte,Tea,1,85.00,85.00,38.25,46.75,72.41,-25.66,-54.9%,Grab,Card,Buy 1 Get 1,Student Deal,Trang City,4.3
T0823,2026-06-09,14:10,Tue,Jun,Afternoon,C0032,24,Female,Returning,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,37.25,47.75,56.2%,LINE,QR,None,None,Trang City,4.2
T0824,2026-04-28,19:20,Tue,Apr,Evening,C0277,18,Male,Returning,Yes,Americano,Coffee,2,65.00,130.00,0.00,130.00,67.40,62.60,48.2%,ShopeeFood,Card,None,None,Trang City,4.3
T0825,2026-06-12,19:50,Fri,Jun,Evening,C0247,20,Female,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,Grab,QR,None,None,Huai Yot,4.7
T0826,2026-02-18,14:15,Wed,Feb,Afternoon,C0360,25,Female,Returning,Yes,Butter Croissant,Bakery,2,55.00,110.00,0.00,110.00,55.50,54.50,49.6%,LINE,Card,None,None,Trang City,4.6
T0827,2026-04-11,21:35,Sat,Apr,Evening,C0260,23,Female,VIP,Yes,Iced Latte,Coffee,1,75.00,75.00,7.50,67.50,40.15,27.35,40.5%,Grab,QR,10% Discount,Student Deal,Huai Yot,4.1
T0828,2026-06-24,12:50,Wed,Jun,Lunch,C0122,55,Male,Returning,Yes,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,47.50,27.50,36.7%,Grab,Cash,None,None,Huai Yot,4.5
T0829,2026-04-18,20:15,Sat,Apr,Evening,C0302,18,Female,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,8.25,46.75,33.41,13.34,28.5%,ShopeeFood,QR,Combo 15%,Weekend Boost,Huai Yot,4.7
T0830,2026-04-14,18:05,Tue,Apr,Evening,C0233,18,Female,New,No,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,47.50,27.50,36.7%,ShopeeFood,Cash,None,None,Trang City,4.6
T0831,2026-01-05,13:55,Mon,Jan,Lunch,C0163,22,Female,Returning,Yes,Americano,Coffee,2,65.00,130.00,0.00,130.00,50.50,79.50,61.2%,LINE,QR,None,None,Trang City,3.9
T0832,2026-04-12,14:05,Sun,Apr,Afternoon,C0357,19,Male,New,No,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,63.50,86.50,57.7%,LINE,QR,None,None,Trang City,4.6
T0833,2026-03-16,21:55,Mon,Mar,Evening,C0191,18,Male,New,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,37.60,32.40,46.3%,Grab,Cash,None,None,Trang City,4.2
T0834,2026-03-16,14:40,Mon,Mar,Afternoon,C0318,33,Female,Returning,Yes,Caramel Macchiato,Coffee,2,85.00,170.00,0.00,170.00,66.00,104.00,61.2%,Store,QR,None,None,Trang City,4.7
T0835,2026-06-22,14:55,Mon,Jun,Afternoon,C0206,32,Male,New,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,32.00,53.00,62.4%,Store,Card,None,None,Trang City,4.7
T0836,2026-06-02,10:55,Tue,Jun,Morning,C0113,35,Male,New,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,45.00,44.00,49.4%,Store,QR,None,None,Huai Yot,4.7
T0837,2026-02-23,17:30,Mon,Feb,Afternoon,C0238,19,Female,Returning,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,25.25,39.75,61.2%,LINE,Cash,None,None,Kantang,4.6
T0838,2026-01-23,14:55,Fri,Jan,Afternoon,C0346,36,Male,New,No,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,56.00,94.00,62.7%,Store,QR,None,None,Trang City,4.7
T0839,2026-04-07,21:20,Tue,Apr,Evening,C0180,21,Female,Returning,Yes,Ham Cheese Sandwich,Snack,2,89.00,178.00,0.00,178.00,98.90,79.10,44.4%,LINE,Card,None,None,Huai Yot,4.1
T0840,2026-05-21,18:15,Thu,May,Evening,C0198,44,Male,Returning,Yes,Caramel Macchiato,Coffee,2,85.00,170.00,0.00,170.00,74.50,95.50,56.2%,LINE,QR,None,None,Trang City,3.5
T0841,2026-04-18,12:20,Sat,Apr,Lunch,C0311,31,Female,VIP,Yes,Caramel Macchiato,Coffee,2,85.00,170.00,0.00,170.00,66.00,104.00,61.2%,Store,QR,None,None,Huai Yot,3.8
T0842,2026-01-14,16:15,Wed,Jan,Afternoon,C0080,22,Male,Returning,Yes,Thai Tea,Tea,2,65.00,130.00,0.00,130.00,71.40,58.60,45.1%,Grab,QR,None,None,Trang City,3.9
T0843,2026-04-26,20:50,Sun,Apr,Evening,C0143,18,Female,Returning,No,Butter Croissant,Bakery,1,55.00,55.00,24.75,30.25,55.44,-25.19,-83.3%,Grab,QR,Buy 1 Get 1,Student Deal,Trang City,3.8
T0844,2026-06-14,16:50,Sun,Jun,Afternoon,C0352,27,Female,New,No,Ham Cheese Sandwich,Snack,2,89.00,178.00,0.00,178.00,90.00,88.00,49.4%,Store,QR,None,None,Trang City,4.5
T0845,2026-01-23,11:45,Fri,Jan,Lunch,C0239,33,Female,Returning,Yes,Americano,Coffee,1,65.00,65.00,0.00,65.00,22.00,43.00,66.2%,Store,QR,None,None,Trang City,5.0
T0846,2026-05-25,16:00,Mon,May,Afternoon,C0240,41,Male,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,27.25,37.75,58.1%,LINE,QR,None,None,Trang City,4.2
T0847,2026-04-13,08:15,Mon,Apr,Morning,C0358,21,Female,Returning,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,33.00,52.00,61.2%,Store,Card,None,None,Huai Yot,3.5
T0848,2026-05-23,11:10,Sat,May,Lunch,C0121,22,Female,New,No,Ham Cheese Sandwich,Snack,2,89.00,178.00,26.70,151.30,117.23,34.07,22.5%,Grab,QR,Combo 15%,Weekend Boost,Trang City,3.9
T0849,2026-04-13,08:40,Mon,Apr,Morning,C0020,38,Male,Returning,Yes,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,37.75,37.25,49.7%,LINE,QR,None,None,Trang City,4.9
T0850,2026-03-07,12:55,Sat,Mar,Lunch,C0195,21,Male,VIP,Yes,Caramel Macchiato,Coffee,2,85.00,170.00,0.00,170.00,96.60,73.40,43.2%,Grab,QR,None,None,Trang City,4.6
T0851,2026-01-08,12:00,Thu,Jan,Lunch,C0153,24,Male,New,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,33.70,31.30,48.2%,ShopeeFood,Card,None,None,Trang City,4.6
T0852,2026-01-22,18:30,Thu,Jan,Evening,C0107,20,Female,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,6.50,58.50,34.53,23.97,41.0%,Grab,Card,10% Discount,Student Deal,Trang City,4.1
T0853,2026-02-18,21:00,Wed,Feb,Evening,C0044,20,Female,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,45.00,44.00,49.4%,Store,QR,None,None,Trang City,3.9
T0854,2026-02-03,21:00,Tue,Feb,Evening,C0086,21,Female,New,No,Iced Latte,Coffee,1,75.00,75.00,7.50,67.50,31.38,36.12,53.5%,LINE,Card,10% Discount,Student Deal,Trang City,3.8
T0855,2026-06-17,17:35,Wed,Jun,Afternoon,C0197,27,Male,Returning,Yes,Peach Tea,Tea,2,70.00,140.00,0.00,140.00,50.00,90.00,64.3%,Store,Card,None,None,Huai Yot,4.2
T0856,2026-04-09,20:45,Thu,Apr,Evening,C0179,21,Female,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,31.75,43.25,57.7%,LINE,Card,None,None,Trang City,4.5
T0857,2026-04-06,20:15,Mon,Apr,Evening,C0172,21,Female,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,Grab,Card,None,None,Trang City,4.7
T0858,2026-06-14,10:05,Sun,Jun,Morning,C0067,25,Female,New,No,Americano,Coffee,2,65.00,130.00,19.50,110.50,44.00,66.50,60.2%,Store,QR,Combo 15%,Weekend Boost,Trang City,4.7
T0859,2026-04-05,15:20,Sun,Apr,Afternoon,C0060,39,Female,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,9.75,55.25,33.95,21.30,38.6%,Grab,QR,Combo 15%,Weekend Boost,Kantang,3.7
T0860,2026-06-04,08:00,Thu,Jun,Morning,C0248,34,Female,New,No,French Fries,Snack,1,69.00,69.00,0.00,69.00,34.45,34.55,50.1%,LINE,QR,None,None,Trang City,4.5
T0861,2026-02-06,17:15,Fri,Feb,Afternoon,C0056,21,Female,New,No,Butter Croissant,Bakery,2,55.00,110.00,0.00,110.00,69.80,40.20,36.6%,ShopeeFood,Card,None,None,Trang City,3.4
T0862,2026-03-02,21:10,Mon,Mar,Evening,C0266,21,Male,Returning,No,Butter Croissant,Bakery,2,55.00,110.00,22.00,88.00,79.40,8.60,9.8%,LINE,QR,Buy 1 Get 1,Student Deal,Trang City,4.6
T0863,2026-05-14,15:10,Thu,May,Afternoon,C0192,22,Female,New,No,French Fries,Snack,1,69.00,69.00,0.00,69.00,43.42,25.58,37.1%,ShopeeFood,Cash,None,None,Trang City,4.4
T0864,2026-06-19,17:25,Fri,Jun,Afternoon,C0069,21,Female,Returning,Yes,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,32.00,53.00,62.4%,Store,Card,None,None,Trang City,5.0
T0865,2026-01-29,19:25,Thu,Jan,Evening,C0039,38,Female,New,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,8.90,80.10,59.42,20.68,25.8%,Grab,QR,10% Discount,Payday,Trang City,4.2
T0866,2026-05-07,19:15,Thu,May,Evening,C0269,23,Male,New,No,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,27.75,27.25,49.6%,LINE,QR,None,None,Trang City,4.1
T0867,2026-05-31,11:40,Sun,May,Lunch,C0331,28,Male,New,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,24.00,41.00,63.1%,Store,Card,None,None,Kantang,4.4
T0868,2026-06-19,08:25,Fri,Jun,Morning,C0164,33,Female,Returning,Yes,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,32.00,53.00,62.4%,Store,QR,None,None,Kantang,4.3
T0869,2026-05-22,15:20,Fri,May,Afternoon,C0290,28,Female,Returning,Yes,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,56.00,94.00,62.7%,Store,QR,None,None,Kantang,3.8
T0870,2026-03-09,20:05,Mon,Mar,Evening,C0356,24,Female,New,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,33.70,31.30,48.2%,Grab,Card,None,None,Trang City,4.4
T0871,2026-04-06,10:25,Mon,Apr,Morning,C0098,39,Male,VIP,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,35.70,29.30,45.1%,Grab,QR,None,None,Trang City,4.4
T0872,2026-05-06,12:15,Wed,May,Lunch,C0209,24,Male,VIP,Yes,Matcha Latte,Tea,2,85.00,170.00,0.00,170.00,94.60,75.40,44.4%,Grab,QR,None,None,Huai Yot,4.9
T0873,2026-04-19,10:50,Sun,Apr,Morning,C0209,28,Female,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,61.02,27.98,31.4%,ShopeeFood,QR,None,None,Trang City,4.3
T0874,2026-06-12,14:05,Fri,Jun,Afternoon,C0350,25,Male,Returning,No,French Fries,Snack,2,69.00,138.00,0.00,138.00,62.00,76.00,55.1%,Store,QR,None,None,Trang City,3.9
T0875,2026-06-24,13:35,Wed,Jun,Lunch,C0340,44,Female,New,No,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,83.00,67.00,44.7%,Grab,Card,None,None,Trang City,4.5
T0876,2026-04-18,14:35,Sat,Apr,Afternoon,C0112,24,Female,Returning,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,37.60,32.40,46.3%,Grab,Cash,None,None,Kantang,4.6
T0877,2026-01-05,17:00,Mon,Jan,Afternoon,C0015,22,Female,Returning,Yes,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,Grab,QR,None,None,Trang City,4.3
T0878,2026-04-17,13:15,Fri,Apr,Lunch,C0175,43,Male,New,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,49.45,39.55,44.4%,LINE,Cash,None,None,Trang City,4.4
T0879,2026-05-22,11:15,Fri,May,Lunch,C0088,23,Female,Returning,Yes,Matcha Latte,Tea,2,85.00,170.00,0.00,170.00,94.60,75.40,44.4%,Grab,Card,None,None,Huai Yot,4.2
T0880,2026-01-29,16:25,Thu,Jan,Afternoon,C0353,22,Male,Returning,Yes,Americano,Coffee,1,65.00,65.00,6.50,58.50,24.93,33.57,57.4%,LINE,QR,10% Discount,Payday,Trang City,4.6
T0881,2026-02-17,12:45,Tue,Feb,Lunch,C0214,28,Female,VIP,Yes,Caramel Macchiato,Coffee,3,85.00,255.00,0.00,255.00,144.90,110.10,43.2%,Grab,QR,None,None,Trang City,4.3
T0882,2026-04-04,20:15,Sat,Apr,Evening,C0175,26,Female,New,No,Iced Latte,Coffee,1,75.00,75.00,11.25,63.75,39.47,24.28,38.1%,Grab,Cash,Combo 15%,Weekend Boost,Trang City,4.1
T0883,2026-01-03,20:35,Sat,Jan,Evening,C0293,45,Female,Returning,No,Ham Cheese Sandwich,Snack,2,89.00,178.00,26.70,151.30,90.00,61.30,40.5%,Store,QR,Combo 15%,Weekend Boost,Trang City,4.2
T0884,2026-02-24,11:40,Tue,Feb,Lunch,C0325,38,Male,Returning,Yes,French Fries,Snack,1,69.00,69.00,0.00,69.00,43.42,25.58,37.1%,Grab,Cash,None,None,Trang City,3.8
T0885,2026-01-02,11:15,Fri,Jan,Lunch,C0088,28,Female,VIP,Yes,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,56.00,94.00,62.7%,Store,QR,None,None,Huai Yot,4.6
T0886,2026-02-01,12:10,Sun,Feb,Lunch,C0176,22,Female,Returning,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,Grab,QR,None,None,Trang City,4.6
T0887,2026-05-01,09:20,Fri,May,Morning,C0279,25,Male,New,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,24.00,41.00,63.1%,Store,QR,None,None,Trang City,4.4
T0888,2026-04-09,08:20,Thu,Apr,Morning,C0081,23,Female,Returning,Yes,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,Grab,Card,None,None,Trang City,4.1
T0889,2026-06-06,09:20,Sat,Jun,Morning,C0358,35,Female,VIP,Yes,Iced Latte,Coffee,2,75.00,150.00,22.50,127.50,56.00,71.50,56.1%,Store,QR,Combo 15%,Weekend Boost,Trang City,4.6
T0890,2026-02-03,11:25,Tue,Feb,Lunch,C0261,29,Female,Returning,No,French Fries,Snack,1,69.00,69.00,0.00,69.00,31.00,38.00,55.1%,Store,QR,None,None,Huai Yot,4.3
T0891,2026-06-19,17:00,Fri,Jun,Afternoon,C0314,36,Male,VIP,Yes,Iced Latte,Coffee,1,75.00,75.00,11.25,63.75,31.19,32.56,51.1%,LINE,QR,Combo 15%,Member Exclusive,Kantang,4.4
T0892,2026-01-02,19:20,Fri,Jan,Evening,C0174,20,Male,New,No,Chocolate Cake,Bakery,2,75.00,150.00,0.00,150.00,95.00,55.00,36.7%,Grab,QR,None,None,Trang City,3.9
T0893,2026-01-06,10:00,Tue,Jan,Morning,C0114,39,Female,New,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,32.00,53.00,62.4%,Store,Card,None,None,Trang City,4.0
T0894,2026-02-22,19:15,Sun,Feb,Evening,C0088,20,Female,New,No,Caramel Macchiato,Coffee,1,85.00,85.00,8.50,76.50,36.83,39.67,51.9%,LINE,QR,10% Discount,Student Deal,Trang City,4.1
T0895,2026-06-14,19:25,Sun,Jun,Evening,C0057,33,Female,Returning,Yes,Iced Latte,Coffee,2,75.00,150.00,22.50,127.50,62.38,65.12,51.1%,LINE,QR,Combo 15%,Weekend Boost,Trang City,4.2
T0896,2026-01-30,12:10,Fri,Jan,Lunch,C0098,25,Male,New,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,31.75,43.25,57.7%,LINE,QR,None,None,Trang City,4.3
T0897,2026-06-03,16:20,Wed,Jun,Afternoon,C0192,23,Female,Returning,Yes,French Fries,Snack,1,69.00,69.00,0.00,69.00,43.42,25.58,37.1%,Grab,QR,None,None,Trang City,4.5
T0898,2026-03-10,14:25,Tue,Mar,Afternoon,C0281,23,Female,Returning,Yes,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,25.00,45.00,64.3%,Store,QR,None,None,Trang City,4.9
T0899,2026-03-20,09:35,Fri,Mar,Morning,C0348,19,Male,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,35.70,29.30,45.1%,ShopeeFood,QR,None,None,Trang City,4.1
T0900,2026-03-17,16:25,Tue,Mar,Afternoon,C0092,43,Male,New,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,45.00,44.00,49.4%,Store,QR,None,None,Trang City,4.5
T0901,2026-02-22,16:25,Sun,Feb,Afternoon,C0259,29,Female,Returning,Yes,Americano,Coffee,1,65.00,65.00,0.00,65.00,33.70,31.30,48.2%,Grab,QR,None,None,Huai Yot,4.5
T0902,2026-06-09,17:00,Tue,Jun,Afternoon,C0083,23,Female,New,No,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,47.50,27.50,36.7%,Grab,QR,None,None,Trang City,4.0
T0903,2026-02-13,12:05,Fri,Feb,Lunch,C0259,23,Male,Returning,Yes,Americano,Coffee,1,65.00,65.00,0.00,65.00,22.00,43.00,66.2%,Store,QR,None,None,Trang City,5.0
T0904,2026-01-29,19:00,Thu,Jan,Evening,C0354,19,Female,Returning,Yes,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,Grab,QR,None,None,Huai Yot,4.6
T0905,2026-05-29,15:40,Fri,May,Afternoon,C0289,23,Female,New,No,Thai Tea,Tea,2,65.00,130.00,13.00,117.00,48.00,69.00,59.0%,Store,QR,10% Discount,Payday,Trang City,3.9
T0906,2026-02-08,11:35,Sun,Feb,Lunch,C0187,54,Male,VIP,Yes,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,32.00,53.00,62.4%,Store,Card,None,None,Trang City,3.6
T0907,2026-04-06,11:40,Mon,Apr,Lunch,C0091,35,Male,Returning,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,37.60,32.40,46.3%,ShopeeFood,Cash,None,None,Kantang,4.0
T0908,2026-03-02,10:50,Mon,Mar,Morning,C0112,23,Male,Returning,Yes,Ham Cheese Sandwich,Snack,2,89.00,178.00,0.00,178.00,122.04,55.96,31.4%,Grab,QR,None,None,Trang City,4.3
T0909,2026-06-11,16:50,Thu,Jun,Afternoon,C0026,21,Female,New,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,QR,None,None,Trang City,4.6
T0910,2026-01-21,12:15,Wed,Jan,Lunch,C0314,42,Male,Returning,Yes,Americano,Coffee,1,65.00,65.00,0.00,65.00,22.00,43.00,66.2%,Store,QR,None,None,Trang City,4.1
T0911,2026-03-01,13:15,Sun,Mar,Lunch,C0158,18,Female,Returning,Yes,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,34.00,41.00,54.7%,Store,Cash,None,None,Kantang,4.4
T0912,2026-05-04,20:10,Mon,May,Evening,C0115,20,Male,New,No,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,83.00,67.00,44.7%,Grab,Cash,None,None,Huai Yot,4.6
T0913,2026-02-15,21:25,Sun,Feb,Evening,C0107,32,Other,VIP,No,Peach Tea,Tea,2,70.00,140.00,0.00,140.00,75.20,64.80,46.3%,Grab,QR,None,None,Huai Yot,4.2
T0914,2026-02-04,10:45,Wed,Feb,Morning,C0164,18,Female,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,34.90,20.10,36.6%,Grab,QR,None,None,Trang City,4.5
T0915,2026-01-31,18:25,Sat,Jan,Evening,C0091,19,Male,Returning,No,Caramel Macchiato,Coffee,1,85.00,85.00,38.25,46.75,66.00,-19.25,-41.2%,Store,Cash,Buy 1 Get 1,Student Deal,Trang City,4.4
T0916,2026-05-09,10:50,Sat,May,Morning,C0266,20,Male,Returning,No,Chocolate Cake,Bakery,3,75.00,225.00,0.00,225.00,142.50,82.50,36.7%,ShopeeFood,QR,None,None,Huai Yot,3.9
T0917,2026-06-20,21:10,Sat,Jun,Evening,C0245,26,Male,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,61.02,27.98,31.4%,ShopeeFood,QR,None,None,Huai Yot,3.9
T0918,2026-04-04,11:45,Sat,Apr,Lunch,C0204,24,Male,VIP,Yes,Matcha Latte,Tea,2,85.00,170.00,0.00,170.00,64.00,106.00,62.4%,Store,QR,None,None,Kantang,4.1
T0919,2026-05-10,09:30,Sun,May,Morning,C0240,31,Female,Returning,Yes,Americano,Coffee,1,65.00,65.00,9.75,55.25,24.76,30.49,55.2%,LINE,Card,Combo 15%,Weekend Boost,Trang City,3.8
T0920,2026-04-08,20:25,Wed,Apr,Evening,C0324,26,Female,Returning,Yes,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,37.25,47.75,56.2%,LINE,Card,None,None,Kantang,4.4
T0921,2026-02-27,10:45,Fri,Feb,Morning,C0027,38,Male,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,45.00,44.00,49.4%,Store,QR,None,None,Trang City,3.9
T0922,2026-05-19,21:45,Tue,May,Evening,C0165,20,Male,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,49.45,39.55,44.4%,LINE,QR,None,None,Trang City,4.2
T0923,2026-03-28,14:15,Sat,Mar,Afternoon,C0268,33,Male,Returning,Yes,Matcha Latte,Tea,3,85.00,255.00,25.50,229.50,137.31,92.19,40.2%,ShopeeFood,Card,10% Discount,Payday,Trang City,4.0
T0924,2026-03-12,10:55,Thu,Mar,Morning,C0028,37,Male,VIP,Yes,Matcha Latte,Tea,3,85.00,255.00,0.00,255.00,141.90,113.10,44.4%,Grab,QR,None,None,Trang City,4.1
T0925,2026-05-06,17:50,Wed,May,Afternoon,C0218,20,Female,Returning,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,Grab,QR,None,None,Trang City,4.2
T0926,2026-06-04,12:35,Thu,Jun,Lunch,C0066,39,Male,Returning,Yes,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,83.00,67.00,44.7%,ShopeeFood,QR,None,None,Kantang,3.8
T0927,2026-01-20,11:45,Tue,Jan,Lunch,C0049,42,Female,VIP,Yes,Butter Croissant,Bakery,2,55.00,110.00,0.00,110.00,50.00,60.00,54.6%,Store,QR,None,None,Trang City,4.0
T0928,2026-05-01,17:45,Fri,May,Afternoon,C0264,19,Male,Returning,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,Grab,QR,None,None,Kantang,4.5
T0929,2026-06-08,17:05,Mon,Jun,Afternoon,C0090,21,Female,Returning,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,28.50,41.50,59.3%,LINE,Card,None,None,Trang City,4.4
T0930,2026-03-04,12:10,Wed,Mar,Lunch,C0034,18,Female,New,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,31.75,43.25,57.7%,LINE,QR,None,None,Trang City,4.5
T0931,2026-01-22,11:30,Thu,Jan,Lunch,C0236,29,Male,VIP,Yes,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,24.00,41.00,63.1%,Store,QR,None,None,Trang City,4.5
T0932,2026-06-28,13:00,Sun,Jun,Lunch,C0030,52,Female,New,No,Iced Latte,Coffee,2,75.00,150.00,0.00,150.00,56.00,94.00,62.7%,Store,QR,None,None,Trang City,3.4
T0933,2026-04-24,19:35,Fri,Apr,Evening,C0148,22,Female,Returning,Yes,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,37.25,47.75,56.2%,LINE,QR,None,None,Trang City,4.3
T0934,2026-04-05,09:15,Sun,Apr,Morning,C0006,26,Other,Returning,Yes,Ham Cheese Sandwich,Snack,2,89.00,178.00,0.00,178.00,98.90,79.10,44.4%,LINE,Card,None,None,Huai Yot,4.3
T0935,2026-02-12,08:50,Thu,Feb,Morning,C0229,32,Male,New,No,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,45.00,44.00,49.4%,Store,Card,None,None,Trang City,4.1
T0936,2026-06-01,09:10,Mon,Jun,Morning,C0299,35,Female,Returning,Yes,Americano,Coffee,2,65.00,130.00,0.00,130.00,67.40,62.60,48.2%,Grab,QR,None,None,Huai Yot,3.6
T0937,2026-03-25,17:45,Wed,Mar,Afternoon,C0149,28,Female,Returning,Yes,French Fries,Snack,1,69.00,69.00,0.00,69.00,31.00,38.00,55.1%,Store,Card,None,None,Trang City,4.2
T0938,2026-03-06,20:50,Fri,Mar,Evening,C0198,21,Female,Returning,Yes,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,25.00,45.00,64.3%,Store,Card,None,None,Trang City,4.3
T0939,2026-06-22,20:35,Mon,Jun,Evening,C0231,22,Other,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,40.05,48.95,92.45,-43.50,-88.9%,LINE,QR,Buy 1 Get 1,Student Deal,Trang City,5.0
T0940,2026-03-08,12:25,Sun,Mar,Lunch,C0035,33,Male,Returning,Yes,French Fries,Snack,2,69.00,138.00,0.00,138.00,86.84,51.16,37.1%,Grab,QR,None,None,Trang City,4.9
T0941,2026-02-27,12:40,Fri,Feb,Lunch,C0252,34,Male,New,No,French Fries,Snack,1,69.00,69.00,0.00,69.00,31.00,38.00,55.1%,Store,QR,None,None,Trang City,3.8
T0942,2026-05-01,19:55,Fri,May,Evening,C0116,20,Male,New,No,Caramel Macchiato,Coffee,1,85.00,85.00,38.25,46.75,66.00,-19.25,-41.2%,Store,QR,Buy 1 Get 1,Student Deal,Trang City,4.5
T0943,2026-02-25,21:20,Wed,Feb,Evening,C0044,22,Male,Returning,Yes,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,48.30,36.70,43.2%,Grab,Card,None,None,Trang City,4.9
T0944,2026-04-29,20:25,Wed,Apr,Evening,C0151,26,Male,New,No,French Fries,Snack,1,69.00,69.00,0.00,69.00,31.00,38.00,55.1%,Store,QR,None,None,Huai Yot,4.8
T0945,2026-01-03,21:55,Sat,Jan,Evening,C0352,21,Male,Returning,Yes,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,48.30,36.70,43.2%,Grab,QR,None,None,Trang City,4.0
T0946,2026-02-09,16:00,Mon,Feb,Afternoon,C0177,27,Other,Returning,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,25.25,39.75,61.2%,LINE,QR,None,None,Kantang,3.6
T0947,2026-01-22,13:45,Thu,Jan,Lunch,C0218,43,Female,New,No,French Fries,Snack,2,69.00,138.00,0.00,138.00,86.84,51.16,37.1%,Grab,Card,None,None,Trang City,4.1
T0948,2026-05-19,11:15,Tue,May,Lunch,C0040,31,Female,Returning,Yes,Ham Cheese Sandwich,Snack,1,89.00,89.00,0.00,89.00,61.02,27.98,31.4%,ShopeeFood,QR,None,None,Trang City,4.1
T0949,2026-01-26,14:25,Mon,Jan,Afternoon,C0159,24,Male,Returning,Yes,Caramel Macchiato,Coffee,2,85.00,170.00,0.00,170.00,74.50,95.50,56.2%,LINE,QR,None,None,Huai Yot,4.4
T0950,2026-06-17,08:10,Wed,Jun,Morning,C0131,24,Male,Returning,Yes,French Fries,Snack,1,69.00,69.00,0.00,69.00,43.42,25.58,37.1%,Grab,QR,None,None,Trang City,4.3
T0951,2026-01-13,21:15,Tue,Jan,Evening,C0028,23,Male,New,No,Iced Latte,Coffee,3,75.00,225.00,0.00,225.00,124.50,100.50,44.7%,Grab,Card,None,None,Trang City,4.2
T0952,2026-01-04,18:50,Sun,Jan,Evening,C0238,26,Female,Returning,Yes,Americano,Coffee,2,65.00,130.00,19.50,110.50,44.00,66.50,60.2%,Store,Card,Combo 15%,Weekend Boost,Trang City,4.0
T0953,2026-02-08,16:45,Sun,Feb,Afternoon,C0064,19,Female,New,No,Butter Croissant,Bakery,2,55.00,110.00,0.00,110.00,50.00,60.00,54.6%,Store,QR,None,None,Huai Yot,4.2
T0954,2026-06-19,17:50,Fri,Jun,Afternoon,C0198,18,Male,Returning,Yes,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,37.25,47.75,56.2%,LINE,QR,None,None,Trang City,4.5
T0955,2026-03-24,21:10,Tue,Mar,Evening,C0179,20,Female,New,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,48.30,36.70,43.2%,Grab,Cash,None,None,Trang City,4.5
T0956,2026-04-22,16:05,Wed,Apr,Afternoon,C0053,51,Male,Returning,Yes,Americano,Coffee,1,65.00,65.00,0.00,65.00,22.00,43.00,66.2%,Store,Cash,None,None,Trang City,5.0
T0957,2026-01-05,20:30,Mon,Jan,Evening,C0180,20,Female,Returning,Yes,Peach Tea,Tea,2,70.00,140.00,14.00,126.00,72.68,53.32,42.3%,Grab,Card,10% Discount,Student Deal,Trang City,4.3
T0958,2026-06-04,19:00,Thu,Jun,Evening,C0097,19,Male,New,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,41.50,33.50,44.7%,Grab,QR,None,None,Trang City,4.6
T0959,2026-04-01,19:10,Wed,Apr,Evening,C0103,19,Female,New,No,Caramel Macchiato,Coffee,3,85.00,255.00,0.00,255.00,144.90,110.10,43.2%,ShopeeFood,QR,None,None,Trang City,4.2
T0960,2026-05-15,19:35,Fri,May,Evening,C0117,23,Male,New,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,48.30,36.70,43.2%,Grab,QR,None,None,Huai Yot,4.1
T0961,2026-05-07,18:10,Thu,May,Evening,C0228,19,Female,Returning,Yes,Caramel Macchiato,Coffee,2,85.00,170.00,0.00,170.00,96.60,73.40,43.2%,Grab,QR,None,None,Huai Yot,4.1
T0962,2026-04-08,16:45,Wed,Apr,Afternoon,C0116,19,Male,Returning,No,Butter Croissant,Bakery,2,55.00,110.00,0.00,110.00,69.80,40.20,36.6%,Grab,QR,None,None,Trang City,4.7
T0963,2026-04-14,16:50,Tue,Apr,Afternoon,C0105,22,Female,Returning,Yes,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,35.70,29.30,45.1%,Grab,QR,None,None,Trang City,4.2
T0964,2026-05-05,14:50,Tue,May,Afternoon,C0278,28,Male,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,QR,None,None,Trang City,4.3
T0965,2026-03-17,13:20,Tue,Mar,Lunch,C0123,31,Male,New,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,ShopeeFood,Card,None,None,Trang City,5.0
T0966,2026-06-06,09:25,Sat,Jun,Morning,C0048,23,Male,Returning,No,Thai Tea,Tea,1,65.00,65.00,9.75,55.25,24.00,31.25,56.6%,Store,QR,Combo 15%,Weekend Boost,Trang City,3.9
T0967,2026-02-23,16:15,Mon,Feb,Afternoon,C0340,35,Female,New,No,Peach Tea,Tea,2,70.00,140.00,0.00,140.00,50.00,90.00,64.3%,Store,Card,None,None,Trang City,4.8
T0968,2026-04-22,13:30,Wed,Apr,Lunch,C0326,27,Male,Returning,Yes,Butter Croissant,Bakery,2,55.00,110.00,0.00,110.00,69.80,40.20,36.6%,Grab,QR,None,None,Huai Yot,3.8
T0969,2026-05-02,20:50,Sat,May,Evening,C0176,20,Male,New,No,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,28.50,41.50,59.3%,LINE,QR,None,None,Trang City,4.6
T0970,2026-06-03,21:40,Wed,Jun,Evening,C0186,21,Male,New,No,Iced Latte,Coffee,1,75.00,75.00,7.50,67.50,40.15,27.35,40.5%,Grab,Card,10% Discount,Student Deal,Trang City,4.5
T0971,2026-04-05,17:00,Sun,Apr,Afternoon,C0291,22,Female,New,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,47.30,37.70,44.4%,Grab,Card,None,None,Trang City,4.3
T0972,2026-04-28,20:15,Tue,Apr,Evening,C0101,19,Female,Returning,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,48.30,36.70,43.2%,ShopeeFood,Card,None,None,Trang City,4.5
T0973,2026-04-26,15:10,Sun,Apr,Afternoon,C0218,19,Other,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,31.75,43.25,57.7%,LINE,QR,None,None,Trang City,4.8
T0974,2026-04-19,09:10,Sun,Apr,Morning,C0091,51,Female,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,25.00,30.00,54.6%,Store,QR,None,None,Trang City,3.9
T0975,2026-02-12,12:15,Thu,Feb,Lunch,C0351,20,Male,New,No,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,34.90,20.10,36.6%,Grab,QR,None,None,Trang City,3.9
T0976,2026-05-24,09:45,Sun,May,Morning,C0319,22,Male,Returning,Yes,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,28.00,47.00,62.7%,Store,Card,None,None,Huai Yot,4.3
T0977,2026-03-07,21:50,Sat,Mar,Evening,C0003,20,Male,New,No,Matcha Latte,Tea,1,85.00,85.00,0.00,85.00,36.25,48.75,57.4%,LINE,QR,None,None,Huai Yot,4.6
T0978,2026-01-07,08:15,Wed,Jan,Morning,C0075,32,Male,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,25.00,30.00,54.6%,Store,Card,None,None,Trang City,4.7
T0979,2026-01-20,16:00,Tue,Jan,Afternoon,C0306,18,Male,New,No,Iced Latte,Coffee,1,75.00,75.00,0.00,75.00,31.75,43.25,57.7%,LINE,QR,None,None,Trang City,3.6
T0980,2026-05-28,12:25,Thu,May,Lunch,C0086,20,Female,New,No,Thai Tea,Tea,1,65.00,65.00,0.00,65.00,35.70,29.30,45.1%,Grab,Cash,None,None,Trang City,4.2
T0981,2026-05-02,16:30,Sat,May,Afternoon,C0315,22,Male,Returning,Yes,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,37.75,37.25,49.7%,LINE,QR,None,None,Trang City,4.3
T0982,2026-04-24,21:15,Fri,Apr,Evening,C0307,24,Female,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,34.90,20.10,36.6%,Grab,QR,None,None,Trang City,4.7
T0983,2026-01-30,21:40,Fri,Jan,Evening,C0182,21,Female,Returning,Yes,Ham Cheese Sandwich,Snack,2,89.00,178.00,17.80,160.20,98.01,62.19,38.8%,LINE,QR,10% Discount,Payday,Trang City,3.8
T0984,2026-03-18,21:00,Wed,Mar,Evening,C0063,18,Female,New,No,Americano,Coffee,1,65.00,65.00,0.00,65.00,33.70,31.30,48.2%,ShopeeFood,QR,None,None,Trang City,4.8
T0985,2026-01-17,17:50,Sat,Jan,Afternoon,C0188,18,Female,Returning,Yes,Peach Tea,Tea,2,70.00,140.00,0.00,140.00,75.20,64.80,46.3%,Grab,Card,None,None,Trang City,4.5
T0986,2026-05-31,17:50,Sun,May,Afternoon,C0064,22,Male,Returning,Yes,Iced Latte,Coffee,3,75.00,225.00,22.50,202.50,94.12,108.38,53.5%,LINE,QR,10% Discount,Payday,Trang City,4.1
T0987,2026-02-20,15:05,Fri,Feb,Afternoon,C0211,24,Male,Returning,Yes,Chocolate Cake,Bakery,2,75.00,150.00,0.00,150.00,95.00,55.00,36.7%,ShopeeFood,QR,None,None,Trang City,3.8
T0988,2026-03-02,11:35,Mon,Mar,Lunch,C0164,35,Female,New,No,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,34.90,20.10,36.6%,Grab,QR,None,None,Trang City,4.8
T0989,2026-01-10,19:40,Sat,Jan,Evening,C0122,29,Female,VIP,No,Matcha Latte,Tea,1,85.00,85.00,12.75,72.25,35.61,36.64,50.7%,LINE,Cash,Combo 15%,Weekend Boost,Trang City,4.0
T0990,2026-03-09,20:55,Mon,Mar,Evening,C0305,23,Female,New,No,Americano,Coffee,1,65.00,65.00,6.50,58.50,32.53,25.97,44.4%,ShopeeFood,QR,10% Discount,Student Deal,Trang City,3.4
T0991,2026-02-16,21:50,Mon,Feb,Evening,C0326,24,Male,Returning,Yes,Caramel Macchiato,Coffee,3,85.00,255.00,25.50,229.50,110.48,119.02,51.9%,LINE,QR,10% Discount,Student Deal,Trang City,4.9
T0992,2026-06-27,18:25,Sat,Jun,Evening,C0059,18,Male,Returning,Yes,French Fries,Snack,1,69.00,69.00,0.00,69.00,43.42,25.58,37.1%,Grab,QR,None,None,Trang City,4.6
T0993,2026-06-03,16:40,Wed,Jun,Afternoon,C0280,21,Male,New,No,French Fries,Snack,2,69.00,138.00,0.00,138.00,86.84,51.16,37.1%,ShopeeFood,Cash,None,None,Kantang,4.5
T0994,2026-02-02,20:00,Mon,Feb,Evening,C0329,27,Male,Returning,No,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,25.00,30.00,54.6%,Store,Card,None,None,Huai Yot,4.0
T0995,2026-05-08,19:20,Fri,May,Evening,C0333,22,Male,New,No,Caramel Macchiato,Coffee,2,85.00,170.00,34.00,136.00,123.48,12.52,9.2%,Grab,Card,Buy 1 Get 1,Student Deal,Trang City,4.3
T0996,2026-02-19,11:45,Thu,Feb,Lunch,C0274,52,Female,Returning,Yes,Butter Croissant,Bakery,1,55.00,55.00,0.00,55.00,25.00,30.00,54.6%,Store,QR,None,None,Trang City,4.3
T0997,2026-06-02,15:15,Tue,Jun,Afternoon,C0009,21,Female,New,No,French Fries,Snack,1,69.00,69.00,0.00,69.00,43.42,25.58,37.1%,Grab,QR,None,None,Huai Yot,4.5
T0998,2026-05-20,11:50,Wed,May,Lunch,C0160,48,Female,New,No,Chocolate Cake,Bakery,1,75.00,75.00,0.00,75.00,34.00,41.00,54.7%,Store,QR,None,None,Trang City,4.2
T0999,2026-05-19,14:40,Tue,May,Afternoon,C0254,22,Male,New,No,Caramel Macchiato,Coffee,1,85.00,85.00,0.00,85.00,48.30,36.70,43.2%,Grab,Card,None,None,Trang City,4.3
T1000,2026-02-24,19:15,Tue,Feb,Evening,C0348,23,Female,Returning,Yes,Peach Tea,Tea,1,70.00,70.00,0.00,70.00,37.60,32.40,46.3%,Grab,Card,None,None,Huai Yot,3.9
`;

// CSV Parsing Helper Function
const parseCSV = (csvText) => {
  const lines = csvText.split('\n').filter(line => line.trim().length > 0);
  if (lines.length < 2) return [];
  
  const headers = lines[0].split(',').map(h => h.trim().replace(/\r/g, '').replace(/ /g, '_'));
  const parsedData = [];
  
  for (let i = 1; i < lines.length; i++) {
      // Basic CSV parsing that handles simple commas.
      const currentLine = lines[i].split(',').map(v => v.trim().replace(/\r/g, ''));
      // Only process lines that have roughly the right number of columns to avoid blank lines
      if (currentLine.length > 5) {
          const row = {};
          // Safely map columns even if there are slight mismatches
          for (let j = 0; j < headers.length; j++) {
              row[headers[j]] = currentLine[j] || '';
          }
          parsedData.push(row);
      }
  }
  
  return parsedData.map(row => ({
    ...row,
    Gross_Sales: parseFloat(row.Gross_Sales) || parseFloat(row.Net_Sales) || 0,
    Net_Sales: parseFloat(row.Net_Sales) || parseFloat(row.Gross_Sales) || 0,
    Profit: parseFloat(row.Profit) || 0,
    Quantity: parseInt(row.Quantity) || 0,
    Customer_Rating: parseFloat(row.Customer_Rating) || null,
    Month: row.Month || (row.Date ? new Date(row.Date).toLocaleString('default', { month: 'short' }) : 'Unknown')
  }));
};

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [fileName, setFileName] = useState('Embedded Dataset');
  const [error, setError] = useState(null);
  const [isUsingEmbedded, setIsUsingEmbedded] = useState(true);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Filter States
  const [filters, setFilters] = useState({
    Location: 'All',
    Category: 'All',
    Campaign: 'All',
    Channel: 'All'
  });

  // Parse embedded data on load
  useEffect(() => {
    try {
      const parsedData = parseCSV(EMBEDDED_CSV_DATA);
      if (parsedData.length > 0) {
        setData(parsedData);
        setIsUsingEmbedded(true);
        // Removed the error warning for small data so it looks completely clean in production
      } else {
        throw new Error("No valid data found in embedded CSV");
      }
    } catch (err) {
      setError(`Error loading data: ${err.message}`);
    } finally {
      setIsInitializing(false);
    }
  }, []);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      try {
        const cleansedData = parseCSV(text);
        
        if (cleansedData.length === 0) throw new Error("CSV file is empty or invalid format.");
        
        setData(cleansedData);
        setFileName(file.name);
        setError(null);
        setIsUsingEmbedded(false);
      } catch (err) {
        console.error("Error parsing CSV:", err);
        setError(`Could not parse CSV: ${err.message}`);
      }
    };
    
    reader.onerror = () => {
      setError('Failed to read the file.');
    };
    
    reader.readAsText(file);
  };

  const filterOptions = useMemo(() => {
    const options = {
      Location: new Set(),
      Category: new Set(),
      Campaign: new Set(),
      Channel: new Set(),
    };
    
    data.forEach(row => {
      if (row.Location) options.Location.add(row.Location);
      if (row.Category) options.Category.add(row.Category);
      if (row.Campaign) options.Campaign.add(row.Campaign);
      if (row.Channel) options.Channel.add(row.Channel);
    });

    return {
      Location: ['All', ...Array.from(options.Location).sort()],
      Category: ['All', ...Array.from(options.Category).sort()],
      Campaign: ['All', ...Array.from(options.Campaign).sort()],
      Channel: ['All', ...Array.from(options.Channel).sort()],
    };
  }, [data]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const filteredData = useMemo(() => {
    return data.filter(row => {
      return (
        (filters.Location === 'All' || row.Location === filters.Location) &&
        (filters.Category === 'All' || row.Category === filters.Category) &&
        (filters.Campaign === 'All' || row.Campaign === filters.Campaign) &&
        (filters.Channel === 'All' || row.Channel === filters.Channel)
      );
    });
  }, [data, filters]);

  const kpis = useMemo(() => {
    const totalSales = filteredData.reduce((sum, row) => sum + (row.Net_Sales || 0), 0);
    const totalProfit = filteredData.reduce((sum, row) => sum + (row.Profit || 0), 0);
    const totalOrders = filteredData.length;
    
    const ratedOrders = filteredData.filter(r => r.Customer_Rating > 0);
    const avgRating = ratedOrders.length > 0 
      ? (ratedOrders.reduce((sum, row) => sum + row.Customer_Rating, 0) / ratedOrders.length).toFixed(1) 
      : 'N/A';

    return { totalSales, totalProfit, totalOrders, avgRating };
  }, [filteredData]);

  const chartsData = useMemo(() => {
    const trendMap = {};
    const categoryMap = {};
    const channelMap = {};
    
    filteredData.forEach(row => {
      if (row.Month) {
        if (!trendMap[row.Month]) trendMap[row.Month] = { name: row.Month, Sales: 0, Profit: 0 };
        trendMap[row.Month].Sales += row.Net_Sales || 0;
        trendMap[row.Month].Profit += row.Profit || 0;
      }
      
      if (row.Category) {
        if (!categoryMap[row.Category]) categoryMap[row.Category] = { name: row.Category, value: 0 };
        categoryMap[row.Category].value += row.Net_Sales || 0;
      }
      
      if (row.Channel) {
        if (!channelMap[row.Channel]) channelMap[row.Channel] = { name: row.Channel, Sales: 0 };
        channelMap[row.Channel].Sales += row.Net_Sales || 0;
      }
    });

    const monthOrder = { 'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6, 'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12 };
    
    return {
      trend: Object.values(trendMap).sort((a, b) => (monthOrder[a.name] || 99) - (monthOrder[b.name] || 99)),
      category: Object.values(categoryMap).sort((a, b) => b.value - a.value),
      channel: Object.values(channelMap).sort((a, b) => b.Sales - a.Sales),
    };
  }, [filteredData]);

  if (isInitializing) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50"><p className="text-slate-500 font-medium text-lg">Initializing Dashboard...</p></div>;
  }

  return (
    <div className="min-h-screen bg-[#f7f6f2] text-slate-900 font-sans p-4 md:p-7 lg:p-9">
      
      {/* Header & Controls */}
      <div className="mb-7 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/90 p-6 md:p-7 rounded-2xl shadow-[0_8px_32px_rgba(32,47,38,0.06)] border border-[#e7e7df]">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#244c3c] text-white shadow-sm"><ShoppingCart size={23} /></div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.24em] font-bold text-[#66816f] mb-1">NOVA CAFE · INSIGHTS</p>
              <h1 className="text-2xl md:text-3xl font-bold text-[#20372c] tracking-tight">Business Dashboard</h1>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500"></span>
            <p className="text-sm text-slate-600 font-medium">
              Demo dataset <span className="text-slate-300 mx-1">·</span> {data.length.toLocaleString()} transactions analyzed
            </p>
          </div>
        </div>
      </div>

      {/* Messages - Only show actual fatal errors now */}
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start gap-3">
          <AlertCircle className="text-red-600 mt-0.5" size={20} />
          <div>
            <h3 className="text-red-800 font-medium">System Error</h3>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        </div>
      )}

      {/* Filters Section */}
      <div className="bg-white p-4 rounded-2xl shadow-[0_5px_24px_rgba(32,47,38,0.045)] border border-[#e7e7df] mb-6 flex flex-col lg:flex-row gap-4 items-center">
        <div className="flex items-center gap-2 text-slate-500 font-medium mr-2">
          <Filter size={18} />
          Filters
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 w-full">
          {Object.keys(filters).map((filterKey) => (
            <div key={filterKey} className="flex flex-col">
              <label className="text-xs text-slate-500 mb-1 font-medium">{filterKey.replace('_', ' ')}</label>
              <select 
                className="bg-slate-50 border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 outline-none transition-all cursor-pointer"
                value={filters[filterKey]}
                onChange={(e) => handleFilterChange(filterKey, e.target.value)}
              >
                {filterOptions[filterKey].map(opt => (
                  <option key={opt} value={opt}>{opt || '(Empty)'}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
        <button 
          onClick={() => setFilters({Location: 'All', Category: 'All', Campaign: 'All', Channel: 'All'})}
          className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-800 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium w-full lg:w-auto justify-center"
        >
          <RefreshCw size={16} /> Reset
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-white rounded-2xl shadow-[0_5px_24px_rgba(32,47,38,0.045)] border border-[#e7e7df] p-6 flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Revenue</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-2">฿{kpis.totalSales.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
            <DollarSign size={24} />
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-[0_5px_24px_rgba(32,47,38,0.045)] border border-[#e7e7df] p-6 flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Net Profit</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-2">฿{kpis.totalProfit.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
            <TrendingUp size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_5px_24px_rgba(32,47,38,0.045)] border border-[#e7e7df] p-6 flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Transactions</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-2">{kpis.totalOrders.toLocaleString()}</h3>
          </div>
          <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center text-amber-600">
            <ShoppingCart size={24} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_5px_24px_rgba(32,47,38,0.045)] border border-[#e7e7df] p-6 flex items-center justify-between hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-pink-500"></div>
          <div>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">Avg. Rating</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-2">{kpis.avgRating} <span className="text-sm text-slate-400 font-normal">/ 5.0</span></h3>
          </div>
          <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-pink-600">
            <Star size={24} />
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        
        {/* Trend Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_5px_24px_rgba(32,47,38,0.045)] border border-[#e7e7df]">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Revenue & Profit Trends (Monthly)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartsData.trend} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `฿${value/1000}k`} dx={-10} />
                <Tooltip 
                  contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value) => [`฿${value.toLocaleString()}`, undefined]}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                <Line yAxisId="left" type="monotone" dataKey="Sales" stroke="#0ea5e9" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                <Line yAxisId="left" type="monotone" dataKey="Profit" stroke="#10b981" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_5px_24px_rgba(32,47,38,0.045)] border border-[#e7e7df] flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Sales by Product Category</h3>
          <div className="h-72 w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartsData.category}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {chartsData.category.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`฿${value.toLocaleString()}`, 'Sales']}
                  contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Channel Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-[0_5px_24px_rgba(32,47,38,0.045)] border border-[#e7e7df] lg:col-span-2">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Sales by Channel Performance</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartsData.channel} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} tickFormatter={(value) => `฿${value/1000}k`} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} width={80} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9'}}
                  contentStyle={{borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                  formatter={(value) => [`฿${value.toLocaleString()}`, 'Sales']}
                />
                <Bar dataKey="Sales" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={32}>
                  {chartsData.channel.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[(index+4) % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Raw Data Table Preview */}
      <div className="bg-white p-6 rounded-2xl shadow-[0_5px_24px_rgba(32,47,38,0.045)] border border-[#e7e7df]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
          <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium border border-slate-200">
            Showing top 5 matches
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm text-slate-500">
                <th className="pb-3 pr-4 font-medium uppercase tracking-wider text-xs">ID</th>
                <th className="pb-3 pr-4 font-medium uppercase tracking-wider text-xs">Date</th>
                <th className="pb-3 pr-4 font-medium uppercase tracking-wider text-xs">Location</th>
                <th className="pb-3 pr-4 font-medium uppercase tracking-wider text-xs">Category</th>
                <th className="pb-3 pr-4 font-medium uppercase tracking-wider text-xs">Channel</th>
                <th className="pb-3 pr-4 font-medium uppercase tracking-wider text-xs text-right">Net Sales</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(0, 5).map((row, idx) => (
                <tr key={idx} className="border-b border-slate-100 last:border-0 text-sm hover:bg-slate-50 transition-colors">
                  <td className="py-3 pr-4 text-slate-800 font-medium">{row.Transaction_ID || 'N/A'}</td>
                  <td className="py-3 pr-4 text-slate-600">{row.Date || 'N/A'}</td>
                  <td className="py-3 pr-4 text-slate-600">{row.Location || 'N/A'}</td>
                  <td className="py-3 pr-4">
                    <span className="bg-slate-100 border border-slate-200 text-slate-700 px-2.5 py-1 rounded-md text-xs font-medium inline-block">
                      {row.Category || 'N/A'}
                    </span>
                  </td>
                  <td className="py-3 pr-4 text-slate-600">{row.Channel || 'N/A'}</td>
                  <td className="py-3 pr-4 text-slate-800 font-semibold text-right">฿{Number(row.Net_Sales || 0).toLocaleString()}</td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-500 bg-slate-50 rounded-lg mt-2">
                    No data matches the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}