# [LTU14-GROUP1](https://github.com/minhnt303/LTU14-GROUP1)
LTU14_GROUP1_IT4883Q_Distributed software development
# [Thành viên trong nhóm]
Stt | Họ tên | MSSV 
--- | --- | ---
1 | Nguyễn Thanh Minh | 20158258 
2 | Nguyễn Đức Hiếu | 20158130 
3 | Mai Ngọc Tú | 20158409 
4 | Nguyễn Khải | 20158197 
# [Cài đặt]

> Giới thiệu công nghệ

Dự án này được chạy trên:
* Môi trường [Node.Js](https://nodejs.org/en/docs/) (Tài liệu: [document](https://nodejs.org/en/docs/))
![](https://img.icons8.com/windows/128/000000/node-js.png)
* Cơ sở dữ liệu sử dụng của [MongoDB](https://docs.mongodb.com/) (Tài liệu: [document](https://docs.mongodb.com/))
![](https://docs.mongodb.com/images/mongodb-logo.png)
* Sử dụng giao diện và dữ liệu bản đồ của [MapBox](https://www.mapbox.com/)(Tài liệu: [document](https://www.mapbox.com/))
![](https://assets.website-files.com/5d3ef00c73102c436bc83996/5d3ef00c73102c893bc83a28_logo-regular-p-500.png)
* Cài đặt và chạy bằng [Docker](https://docs.docker.com/)(Tài liệu: [document](https://docs.docker.com/))
![](https://cdn.thenewstack.io/media/2014/04/homepage-docker-logo.png)
* Truyền dữ liệu, thông tin trong thời gian thực với [Socket.io](https://socket.io/)
![](https://www.programwitherik.com/content/images/2017/01/socket-e1434850599985.png)
### Cài đặt môi trường, csdl
* Cài đặt mô trường Node.Js. Link tải [link](https://nodejs.org/dist/v12.13.1/node-v12.13.1-x64.msi)
* Cài đặt môi trường cơ sở dữ liệu MongoDB. Link tải [link](https://fastdl.mongodb.org/win32/mongodb-win32-x86_64-2012plus-4.2.1-signed.msi)
* Cài đặt giao diện để quan sát cơ sở dữ liệu Robo3T . Link tải [link](https://download-test.robomongo.org/windows/robo3t-1.3.1-windows-x86_64-7419c406.exe)
### Cài đặt các thư viện
```
npm install
```
### Server và CSDL chạy trên cổng 12071
```
yanr start
```
### Xây dựng file sang Docker image
Ta cần cd đến thư mục chứa source code và chạy hai lệnh
```
docker-compose build
```
```
docker-compose up
```
> Mở trình duyệt và truy cập vào đường dẫn localhost:3000
![](https://i.imgur.com/4IDkwwD.png)

> Đăng nhập hoặc đăng ký tài khoản
![](https://i.imgur.com/uEfM11U.png)

>Lấy vị trí hiện tại
![](https://i.imgur.com/7Q8c7ak.png)

>Tìm địa chỉchọn 2 điểm trên bản đồ bằng cách nhấn vào bản đồ hoặc nhập tên trên ô tìm kiếm
![](https://i.imgur.com/Ph6JZGV.png)

>Lấy thông tin lộ trình đường đi
![](https://i.imgur.com/hUSgS6w.png)

>Tìm lái xe và chọn lái xe
![](https://i.imgur.com/C1Sl80h.png)

> Hiển thị vị trí và thông tin của lái xe
![](https://i.imgur.com/r3Lm0BQ.png)

>Khi kết thúc tiến hành thanh toán chi phí di chuyển cho lái xe
![](https://i.imgur.com/x8Cx42n.png)
## Contribution guide
* Fork the repository
* `npm install` or `yarn install`
* Make changes
* Open Pull Request
