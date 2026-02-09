module.exports = {
  apps: [
    // =========================
    // core API (Express)
    // =========================
    {
      name: "core",
      cwd: "/home/owis/apps/core",
      script: "server.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "300M",
      env: {
        NODE_ENV: "production",
        PORT: 3003,
      },
    },
  ],
};
