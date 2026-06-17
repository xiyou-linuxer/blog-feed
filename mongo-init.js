// MongoDB 初始化脚本：为 blog-feed 创建专用用户
// 密码从环境变量注入，不硬编码

db = db.getSiblingDB('admin')

const user = process.env.MONGO_APP_USER || 'blogfeed'
const pwd = process.env.MONGO_APP_PASSWORD

if (!pwd) {
  throw new Error('❌ MONGO_APP_PASSWORD 环境变量未设置')
}

db.createUser({
  user,
  pwd,
  roles: [
    { role: 'readWrite', db: 'blog-feed' },
  ],
})

print(`✅ MongoDB 用户 ${user} 创建完成`)
