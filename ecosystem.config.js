module.exports = {
    apps : [{
      name: `test API`,
      script : "./app.js",
      watch_delay: 1000,
      watch:true,
      ignore_watch : ["node_modules", "public", "seeddata"],
    }]
  }