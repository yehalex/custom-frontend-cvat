# CVAT Image Annotation Workbench

A custom React frontend that integrates with a self-hosted CVAT (Computer Vision Annotation Tool) instance, featuring customized CVAT UI components and task management capabilities.

## Architecture

```
┌─────────────────┐  API calls  ┌─────────────────┐
│                 │ ────────────→ │                 │
│ Custom React    │              │ CVAT Server     │
│ Frontend        │ ←──────────── │ (Modified)      │
│ (Port 5173)     │  JSON data   │ (Port 8080)     │
└─────────────────┘              └─────────────────┘
```

## Prerequisites

- Docker installed and running
- Node.js 18+ and npm

## ⚙️ Setup Instructions

### 1. CVAT Self-Hosted Setup

```bash
# Clone CVAT repository
git clone https://github.com/opencv/cvat
cd cvat

# Create environment file
echo "CVAT_HOST=localhost" > .env
echo "CVAT_POSTGRES_PASSWORD=cvat_password" >> .env

# Start CVAT services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

docker-compose logs -f cvat_server
```

### 2. Create CVAT Superuser

```bash
# Create admin account
docker exec -it cvat_server python3 manage.py createsuperuser

# Recommended credentials:
# Username: admin
# Email: admin@cvat.local
# Password: superpassword
```

### 3. Create Test Data

1. Access CVAT at http://localhost:8080
2. Login with admin credentials
3. Create 2-3 test tasks with sample images
4. Note the task IDs for testing

### 4. Custom Frontend Setup

```bash
# Navigate to custom frontend directory
cd custom-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The custom frontend will be available at http://localhost:5173

## CVAT Frontend Modifications

### Files Modified

**File:** `cvat/cvat-ui/src/components/annotation-page/top-bar/left-group.tsx`

### Changes Made

1. **Removed Redo Button**

   ```typescript
   // COMMENTED OUT: Original redo button
   {
     /* <CVATTooltip overlay={`Redo: ${redoAction} ${redoShortcut}`}>
       <Button
           style={{ pointerEvents: redoAction ? 'initial' : 'none', opacity: redoAction ? 1 : 0.5 }}
           type='link'
           className='cvat-annotation-header-redo-button cvat-annotation-header-button'
           onClick={onRedoClick}
       >
           <Icon component={RedoIcon} />
           Redo
       </Button>
   </CVATTooltip> */
   }
   ```

2. **Added Custom Button**
   ```typescript
   // ADDED: Custom button
   <CVATTooltip overlay="Custom button">
     <Button
       type="link"
       className="cvat-annotation-header-review-complete-button cvat-annotation-header-button"
       onClick={() => {
         alert("custom alert");
       }}
       style={{ color: "#52c41a" }}
     >
       <CheckCircleOutlined />
       custom button
     </Button>
   </CVATTooltip>
   ```

### Building Modified CVAT

```bash
# Stop CVAT services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down

# Rebuild with frontend changes
docker-compose -f docker-compose.yml -f docker-compose.dev.yml build --no-cache

# Start services
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

## 🧪 Testing the Implementation

### 1. Test CVAT Modifications

1. Access CVAT annotation interface at http://localhost:8080
2. Open any annotation task
3. **Verify:** Redo button is missing from the toolbar
4. **Verify:** "custom button" appears in its place
5. **Test:** Click "custom button" to see alert popup

### 2. Test Custom Frontend

1. Access custom frontend at http://localhost:5173
2. **Test Login:** Use admin/superpassword credentials
3. **Test Logout:** Click logout button
4. **Verify:** Project list loads with CVAT tasks
5. **Test:** Click different projects to see task details

### 3. Integration Testing

- ✅ **Login/Logout Flow:** Custom frontend authentication works
- ✅ **Project List:** Displays CVAT tasks via API
- ✅ **CVAT Modifications:** Custom button added, redo button removed
- ✅ **Task Details:** Detailed task view with metadata and controls

## Components Implemented

| Component         | Description                           | Status      |
| ----------------- | ------------------------------------- | ----------- |
| `LoginPanel.jsx`  | Handles CVAT authentication           | ✅ Working  |
| `ProjectList.jsx` | Shows tasks from CVAT API             | ✅ Working  |
| `TaskDetails.jsx` | Detailed task view with metadata      | ✅ Working  |
| `CVATIframe.jsx`  | iframe container (see limitations)    | Not Working |
| `App.jsx`         | Main container with responsive layout | ✅ Working  |

### API Integration

```javascript
// CVAT API service with token-based auth
class CVATApiService {
    async login(username, password)
    async logout()
    async getCurrentUser()
    async getTasks()
    async getTaskDetails(taskId)
    async getTaskPreviewBlobUrl(taskId)
}
```

## ⚠️ Known Issues

### iframe Integration Problem

**Issue:** CVAT sends `X-Frame-Options: DENY` header, preventing iframe embedding.

**Error:**

```
Refused to display 'http://localhost:8080/tasks/123' in a frame because it has set 'X-Frame-Options' to 'deny'.
```

**Impact:**

- Custom frontend can authenticate and list tasks
- Task switching UI is implemented but iframe content doesn't load
- Created detailed task view as alternative

**Potential Solutions** (not implemented due to time constraints):

- Modify CVAT's Django settings to allow iframe embedding
- Use CVAT's API-only mode and rebuild annotation interface
- Implement CVAT as a popup window instead of iframe

### Current Workaround

The custom frontend provides:

- ✅ Authentication working with CVAT
- ✅ Task list loading from CVAT API
- ✅ Detailed task view with metadata
- ✅ UI layout and project switching logic
- ⚠️ iframe integration limited by security headers

## Project Structure

```
├── cvat/                           # CVAT repository (modified)
│   ├── cvat-ui/src/components/
│   │   └── annotation-page/top-bar/
│   │       └── left-group.tsx      # Modified (button changes)
│   ├── docker-compose.yml          # Main services
│   └── docker-compose.dev.yml      # Development build config
│
├── custom-frontend/                # React application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ProjectList.jsx     # Task selection
│   │   │   ├── LoginPanel.jsx      # Authentication
│   │   │   ├── TaskDetails.jsx     # Detailed task view
│   │   │   └── CVATIframe.jsx      # iframe container
│   │   ├── services/
│   │   │   └── cvatApi.js          # CVAT API client
│   │   ├── App.jsx                 # Main application
│   │   └── App.css                 # Styling
│   ├── package.json
│   └── vite.config.js
│
└── README.md                       # This file
```

## Future Improvements

- **Solve iframe embedding:** Solve CVAT headers limitation or fully implement custom front using api
- **Extended API:** More CVAT functionality like task creation/management
- **Authentication:** Session management and token refresh
- **Error Handling:** Robust error boundaries and user feedback

## Acknowledgments

- CVAT team
