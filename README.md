# Museum API

## Installation
```bash
npm install
```

## Start Server
```bash
npm start
# or for development
npm run dev
```

## API Endpoints

### GET All Entries
```
GET /api/museum
```

### GET Entry by ID
```
GET /api/museum/:id
```

### Search by Phone
```
GET /api/museum/search/phone/:phone
```

### Search by Name
```
GET /api/museum/search/name/:name
```

### Search by Date
```
GET /api/museum/search/date/:date
```

### Multiple Search
```
POST /api/museum/search
Body: {
  "phone": "123456",
  "name": "john",
  "date": "2024-01-01",
  "address": "delhi"
}
```

### Create Entry
```
POST /api/museum
Body: {
  "firstname": "John",
  "phone": "1234567890",
  "address": "Delhi",
  "num_of_persons": 2,
  "total_amt": 100,
  "payment": 1
}
```

### Update Entry
```
PUT /api/museum/:id
Body: { ... }
```

### Delete Entry
```
DELETE /api/museum/:id
```