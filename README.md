# Storage Management Backend API

A production-ready storage management backend built using Node.js, Express, MongoDB, and Cloudinary.  
This system supports secure file uploads, folder organization, favorites, soft deletes, and scalable access control.

---

## Features

### Authentication
- JWT-based authentication
- User-scoped access for all resources

### File Management
- Upload files to Cloudinary
- Store file metadata in MongoDB
- Retrieve secure download URLs
- Filter files by type (image, pdf)
- Move files between folders
- Soft delete files
- Destroy Cloudinary assets on delete

### Folder Management
- Root-level and nested folders
- Move files between folders
- Soft delete folders

### Favorites
- Mark files as favorite
- Mark folders as favorite
- Unified favorites listing per user

### Data Safety
- Soft delete strategy using `isDeleted`
- Metadata retained for recovery
- Controlled cleanup of Cloudinary assets

---

## Tech Stack

- Node.js
- Express.js
- MongoDB & Mongoose
- Cloudinary
- JWT Authentication
- Multer
- Postman

---

## API Endpoints

### Files

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | /api/files/upload | Upload a file |
| GET | /api/files | Get all files (filterable) |
| GET | /api/files/:id | Get secure download URL |
| PATCH | /api/files/:id/move | Move file to another folder |
| DELETE | /api/files/:id | Soft delete + Cloudinary destroy |

#### File Filters
GET /api/files?type=image
GET /api/files?type=pdf
GET /api/files


---

### Folders

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | /api/folders | Create folder |
| GET | /api/folders | Get all folders |
| DELETE | /api/folders/:id | Soft delete folder |

---

### Favorites

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | /api/favorites | Add file or folder to favorites |
| GET | /api/favorites | Get all favorites |
| DELETE | /api/favorites/:id | Remove from favorites |

---

## Environment Variables

PORT=5000
MONGO_URI=mongodb://localhost:27017/storage_db
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

---

## Running the Application

Development:
npm install
npm run dev


---

## Design Decisions

- Soft deletes prevent accidental data loss
- Cloudinary `publicId` stored for reliable cleanup
- Favorites stored separately for flexibility
- Indexed queries for performance
- Strict ownership validation

---

## Future Improvements

- Trash & restore
- Folder sharing
- File versioning
- Storage quota enforcement
- Redis caching
- Advanced search

---

## Author

Saim Al Ifran  
Backend / MERN Stack Developer

---

## License

MIT
