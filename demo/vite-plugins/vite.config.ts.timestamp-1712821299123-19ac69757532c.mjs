// vite.config.ts
import { defineConfig } from "file:///Users/gweid/Desktop/study/vite-study/demo/vite-plugins/node_modules/.pnpm/vite@5.2.8_@types+node@20.12.6/node_modules/vite/dist/node/index.js";
import react from "file:///Users/gweid/Desktop/study/vite-study/demo/vite-plugins/node_modules/.pnpm/@vitejs+plugin-react@4.2.1_vite@5.2.8/node_modules/@vitejs/plugin-react/dist/index.mjs";

// plugins/test-hook-plugin.ts
function testHookPlugin() {
  return {
    name: "test-hooks-plugin",
    // Vite 独有钩子
    config() {
      console.log("config");
    },
    // Vite 独有钩子
    configResolved() {
      console.log("configResolved");
    },
    // 通用钩子
    options(opts) {
      console.log("options");
      return opts;
    },
    // Vite 独有钩子
    configureServer() {
      console.log("configureServer");
      setTimeout(() => {
        process.kill(process.pid, "SIGTERM");
      }, 3e3);
    },
    // 通用钩子
    buildStart() {
      console.log("buildStart");
    },
    // 通用钩子
    buildEnd() {
      console.log("buildEnd");
    },
    // 通用钩子
    closeBundle() {
      console.log("closeBundle");
    }
  };
}

// vite.config.ts
var vite_config_default = defineConfig({
  plugins: [
    react(),
    testHookPlugin()
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGx1Z2lucy90ZXN0LWhvb2stcGx1Z2luLnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiL1VzZXJzL2d3ZWlkL0Rlc2t0b3Avc3R1ZHkvdml0ZS1zdHVkeS9kZW1vL3ZpdGUtcGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2d3ZWlkL0Rlc2t0b3Avc3R1ZHkvdml0ZS1zdHVkeS9kZW1vL3ZpdGUtcGx1Z2lucy92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvZ3dlaWQvRGVza3RvcC9zdHVkeS92aXRlLXN0dWR5L2RlbW8vdml0ZS1wbHVnaW5zL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBUZXN0SG9va1BsdWdpbiBmcm9tICcuL3BsdWdpbnMvdGVzdC1ob29rLXBsdWdpbidcblxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIHBsdWdpbnM6IFtcbiAgICByZWFjdCgpLFxuICAgIFRlc3RIb29rUGx1Z2luKClcbiAgXSxcbn0pXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIi9Vc2Vycy9nd2VpZC9EZXNrdG9wL3N0dWR5L3ZpdGUtc3R1ZHkvZGVtby92aXRlLXBsdWdpbnMvcGx1Z2luc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2d3ZWlkL0Rlc2t0b3Avc3R1ZHkvdml0ZS1zdHVkeS9kZW1vL3ZpdGUtcGx1Z2lucy9wbHVnaW5zL3Rlc3QtaG9vay1wbHVnaW4udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2d3ZWlkL0Rlc2t0b3Avc3R1ZHkvdml0ZS1zdHVkeS9kZW1vL3ZpdGUtcGx1Z2lucy9wbHVnaW5zL3Rlc3QtaG9vay1wbHVnaW4udHNcIjtleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0ZXN0SG9va1BsdWdpbigpIHtcbiAgcmV0dXJuIHtcbiAgICBuYW1lOiAndGVzdC1ob29rcy1wbHVnaW4nLFxuICAgIC8vIFZpdGUgXHU3MkVDXHU2NzA5XHU5NEE5XHU1QjUwXG4gICAgY29uZmlnKCkge1xuICAgICAgY29uc29sZS5sb2coJ2NvbmZpZycpO1xuICAgIH0sXG4gICAgLy8gVml0ZSBcdTcyRUNcdTY3MDlcdTk0QTlcdTVCNTBcbiAgICBjb25maWdSZXNvbHZlZCgpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdjb25maWdSZXNvbHZlZCcpO1xuICAgIH0sXG4gICAgLy8gXHU5MDFBXHU3NTI4XHU5NEE5XHU1QjUwXG4gICAgb3B0aW9ucyhvcHRzOiBhbnkpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdvcHRpb25zJyk7XG4gICAgICByZXR1cm4gb3B0cztcbiAgICB9LFxuICAgIC8vIFZpdGUgXHU3MkVDXHU2NzA5XHU5NEE5XHU1QjUwXG4gICAgY29uZmlndXJlU2VydmVyKCkge1xuICAgICAgY29uc29sZS5sb2coJ2NvbmZpZ3VyZVNlcnZlcicpO1xuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIC8vIFx1NjI0Qlx1NTJBOFx1OTAwMFx1NTFGQVx1OEZEQlx1N0EwQlxuICAgICAgICBwcm9jZXNzLmtpbGwocHJvY2Vzcy5waWQsICdTSUdURVJNJyk7XG4gICAgICB9LCAzMDAwKVxuICAgIH0sXG4gICAgLy8gXHU5MDFBXHU3NTI4XHU5NEE5XHU1QjUwXG4gICAgYnVpbGRTdGFydCgpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdidWlsZFN0YXJ0Jyk7XG4gICAgfSxcbiAgICAvLyBcdTkwMUFcdTc1MjhcdTk0QTlcdTVCNTBcbiAgICBidWlsZEVuZCgpIHtcbiAgICAgIGNvbnNvbGUubG9nKCdidWlsZEVuZCcpO1xuICAgIH0sXG4gICAgLy8gXHU5MDFBXHU3NTI4XHU5NEE5XHU1QjUwXG4gICAgY2xvc2VCdW5kbGUoKSB7XG4gICAgICBjb25zb2xlLmxvZygnY2xvc2VCdW5kbGUnKTtcbiAgICB9XG4gIH1cbn0iXSwKICAibWFwcGluZ3MiOiAiO0FBQXVWLFNBQVMsb0JBQW9CO0FBQ3BYLE9BQU8sV0FBVzs7O0FDRHNYLFNBQVIsaUJBQWtDO0FBQ2hhLFNBQU87QUFBQSxJQUNMLE1BQU07QUFBQTtBQUFBLElBRU4sU0FBUztBQUNQLGNBQVEsSUFBSSxRQUFRO0FBQUEsSUFDdEI7QUFBQTtBQUFBLElBRUEsaUJBQWlCO0FBQ2YsY0FBUSxJQUFJLGdCQUFnQjtBQUFBLElBQzlCO0FBQUE7QUFBQSxJQUVBLFFBQVEsTUFBVztBQUNqQixjQUFRLElBQUksU0FBUztBQUNyQixhQUFPO0FBQUEsSUFDVDtBQUFBO0FBQUEsSUFFQSxrQkFBa0I7QUFDaEIsY0FBUSxJQUFJLGlCQUFpQjtBQUM3QixpQkFBVyxNQUFNO0FBRWYsZ0JBQVEsS0FBSyxRQUFRLEtBQUssU0FBUztBQUFBLE1BQ3JDLEdBQUcsR0FBSTtBQUFBLElBQ1Q7QUFBQTtBQUFBLElBRUEsYUFBYTtBQUNYLGNBQVEsSUFBSSxZQUFZO0FBQUEsSUFDMUI7QUFBQTtBQUFBLElBRUEsV0FBVztBQUNULGNBQVEsSUFBSSxVQUFVO0FBQUEsSUFDeEI7QUFBQTtBQUFBLElBRUEsY0FBYztBQUNaLGNBQVEsSUFBSSxhQUFhO0FBQUEsSUFDM0I7QUFBQSxFQUNGO0FBQ0Y7OztBRGhDQSxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTixlQUFlO0FBQUEsRUFDakI7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
