import axios from "axios";

const CVAT_BASE_URL = "/api";

class CVATApiService {
  constructor() {
    this.http = axios.create({
      baseURL: CVAT_BASE_URL,
      timeout: 30000,
      withCredentials: true,
    });

    this.token = localStorage.getItem("cvat_token");
    if (this.token) {
      this.http.defaults.headers.Authorization = `Token ${this.token}`;
    }

    this.setupInterceptors();
  }

  setupInterceptors() {
    this.http.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Token ${this.token}`;
      }
      return config;
    });

    this.http.interceptors.response.use(
      (res) => res,
      (error) => {
        if (error.response?.status === 401) {
          this.token = null;
          localStorage.removeItem("cvat_token");
          delete this.http.defaults.headers.Authorization;
        }
        return Promise.reject(error);
      }
    );
  }

  async health() {
    try {
      const res = await this.http.get("/server/about");
      return { ok: true, data: res.data };
    } catch (error) {
      return { ok: false, error: error.response?.data || error.message };
    }
  }

  async login(username, password) {
    try {
      const response = await this.http.post("/auth/login", {
        username,
        password,
      });
      this.token = response.data.key;
      localStorage.setItem("cvat_token", this.token);
      this.http.defaults.headers.Authorization = `Token ${this.token}`;
      return { success: true, user: response.data };
    } catch (error) {
      return { success: false, error: error.response?.data || error.message };
    }
  }

  async logout() {
    await this.http.post("/auth/logout");

    this.token = null;
    localStorage.removeItem("cvat_token");
    delete this.http.defaults.headers.Authorization;
  }

  async getCurrentUser() {
    try {
      const response = await this.http.get("/users/self");
      return response.data;
    } catch {
      return null;
    }
  }

  // Pagination/sorting filter params pass-through
  async getTasks(params = {}) {
    try {
      const response = await this.http.get("/tasks", { params });
      return response.data; // includes { count, next, previous, results }
    } catch {
      return { count: 0, results: [] };
    }
  }

  async getTask(taskId) {
    const res = await this.http.get(`/tasks/${taskId}`);
    return res.data;
  }

  async createTask(payload) {
    // payload at minimum: { name, labels: [], bug_tracker, project_id, etc. }
    const res = await this.http.post("/tasks", payload);
    return res.data;
  }

  async updateTask(taskId, patch) {
    const res = await this.http.patch(`/tasks/${taskId}`, patch);
    return res.data;
  }

  async deleteTask(taskId) {
    await this.http.delete(`/tasks/${taskId}`);
  }

  async getTaskPreviewBlobUrl(taskId) {
    // Must use XHR to include auth, then create a blob URL for <img>
    const res = await this.http.get(`/tasks/${taskId}/preview`, {
      responseType: "blob",
    });
    return URL.createObjectURL(res.data);
  }

  // Attach data (images/videos) to a task
  async createTaskData(taskId, formData, onUploadProgress) {
    const res = await this.http.post(`/tasks/${taskId}/data/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress,
    });
    return res.data;
  }
}

export default new CVATApiService();
