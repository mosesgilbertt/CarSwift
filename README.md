# Car Swift API Documentation

## Authorization

All endpoints require a **Bearer Token** for authentication.

---

## Public Endpoints

### Fetch All Cars

**GET** `/pub/cars?limit=10&page=1`

#### Query Parameters:

- `search`: `fer`
- `brand`: `Toyota`
- `type`: `SUV`
- `minPrice`: `150000`
- `maxPrice`: `900000`
- `sortBy`: `price_per_day`
- `orderBy`: `desc`
- `limit`: `10`
- `page`: `1`

### Fetch Car By Id

**GET** `/pub/cars/:id`

#### Path Variables:

- `id`: `1`

---

## Authentication

### Register

**POST** `/register`

#### Body (JSON):

```json
{
  "name": "Anto",
  "email": "anto@mail.com",
  "password": "123456",
  "profilePicture": "D:/Hacktiv8/Materi/Phase 2 - REPEAT/Individual Project/photoProfile/3.jpg"
}
```

### Login

**POST** `/login`

#### Body (JSON):

```json
{
  "email": "user@mail.com",
  "password": "123456"
}
```

### Google Login

**POST** `/google-login`

#### Body (JSON):

```json
{
  "googleToken": "<token>"
}
```

---

## User Endpoints

### Get Profile

**GET** `/profile`

### Fetch User's Rental

**GET** `/rentals/my-rentals`

### Update Profile

**PUT** `/profile/update`

#### Body (JSON):

```json
{
  "name": "SuperZeco",
  "email": "admin@mail.com",
  "password": "123456"
}
```

### Delete Account

**DELETE** `/profile/delete`

---

## Car Management

### Get All Cars

**GET** `/cars`

#### Query Parameters:

- `brand`: `Toyota`
- `type`: `SUV`
- `minPrice`: `150000`
- `maxPrice`: `900000`
- `sort`: `price_asc` | `price_desc`

### Get Car By Id

**GET** `/cars/:id`

#### Path Variables:

- `id`: `1`

### Create Rental

**POST** `/rentals/:CarId`

#### Path Variables:

- `CarId`

#### Body (JSON):

```json
{
  "rentalDate": "2025-03-01",
  "returnDate": "2025-03-02"
}
```

### Return Car By Id

**PATCH** `/rentals/:id/return`

#### Path Variables:

- `id`: `2`

### Edit Car By Id

**PUT** `/cars/:id`

#### Path Variables:

- `id`

#### Body (JSON):

```json
{
  "name": "Toyota Alphard",
  "brand": "Toyota",
  "year": 2023,
  "type": "Minivan",
  "image": "https://i.pinimg.com/736x/b8/ab/50/b8ab50b38b5d520223087f500a4a1717.jpg",
  "price_per_day": 1500000,
  "status": "available"
}
```

### Delete Car By Id

**DELETE** `/cars/:id`

#### Path Variables:

- `id`: `16`

---

## Admin Endpoints

### Fetch All Users

**GET** `/admin`

### Fetch All Rentals

**GET** `/rentals`

### Create Car

**POST** `/cars`

#### Body (JSON):

```json
{
  "name": "Honda Civic RS",
  "brand": "Honda",
  "year": 2022,
  "type": "Sedan",
  "price_per_day": 2000000,
  "image": "https://i.pinimg.com/736x/6b/4b/46/6b4b469ab71a10978e0ecd420ef936ca.jpg"
}
```

### Update Role User By Id

**PATCH** `/admin/:id/role`

#### Path Variables:

- `id`
