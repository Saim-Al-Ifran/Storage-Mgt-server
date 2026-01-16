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

### Auth & User Routes

| Method | Endpoint          | Description                |
|--------|-------------------|----------------------------|
| POST   | /register         | Register a new user        |
| POST   | /login            | Login and get access token |
| POST   | /logout           | Logout (requires auth)     |
| PATCH  | /change-password  | Change user password (auth)|
| PATCH  | /profile          | Update user profile (auth) |
| POST   | /refresh-token    | Refresh access token       |


### Files

| Method | Endpoint | Description |
|------|---------|-------------|
| POST | /api/files/upload | Upload a file |
| GET | /api/files | Get all files (filterable) |
| GET | /api/files/:id | Get secure download URL |
| PATCH | /api/files/:id/move | Move file to another folder |
| DELETE | /api/files/:id | Soft delete + Cloudinary destroy |

### File Filters

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/files?type=image | Get all image files |
| GET    | /api/files?type=pdf   | Get all PDF files |
| GET    | /api/files            | Get all files (unfiltered) |



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
NODE_ENV=development

MONGO_URI=mongodb://localhost:27017/storage_db

# JWT
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx

# Optional
CLOUDINARY_FOLDER=app_uploads
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=100


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
