import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Cho phép truy cập từ bên ngoài
    port: 5173,        // Chạy trên cổng 5173
    strictPort: true,
    allowedHosts: ['tixclick.site', 'www.tixclick.site'], // Thêm domain vào danh sách cho phép
  }
})
