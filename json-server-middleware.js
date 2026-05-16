import express from "express"

const router = express.Router()

const db = {
  products: [
    { id: 1, name: "苹果", price: 5, stock: 100, status: "上架" },
    { id: 2, name: "香蕉", price: 3, stock: 50, status: "上架" },
    { id: 3, name: "橙子", price: 6, stock: 80, status: "下架" },
    { id: 4, name: "西瓜", price: 8, stock: 30, status: "上架" },
    { id: 5, name: "葡萄", price: 12, stock: 20, status: "上架" }
  ],
  orders: [
    { id: 1, productId: 1, productName: "苹果", price: 5, quantity: 2, totalAmount: 10, userName: "张三", status: "待处理", createTime: "2025-04-01 10:00" },
    { id: 2, productId: 2, productName: "香蕉", price: 3, quantity: 1, totalAmount: 3, userName: "李四", status: "已发货", createTime: "2025-04-02 14:30" },
    { id: 3, productId: 3, productName: "橙子", price: 6, quantity: 3, totalAmount: 18, userName: "王五", status: "已完成", createTime: "2025-04-03 09:15" }
  ],
  users: [
    { id: 1, username: "admin", email: "admin@example.com", role: "管理员", status: "启用", createTime: "2025-01-10 09:00" },
    { id: 2, username: "zhang_san", email: "zhangsan@example.com", role: "普通用户", status: "启用", createTime: "2025-02-15 14:20" },
    { id: 3, username: "li_si", email: "lisi@example.com", role: "普通用户", status: "停用", createTime: "2025-03-01 10:30" },
    { id: 4, username: "wang_wu", email: "wangwu@example.com", role: "VIP", status: "启用", createTime: "2025-03-10 16:45" }
  ]
}

router.get("/api/v1/auth/captcha", (req, res) => {
  res.json({
    code: 0,
    data: {
      captchaKey: "mock-captcha-key",
      captchaImage: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjx0ZXh0IHg9IjEwIiB5PSIyNSIgZm9udC1zaXplPSIyMCI+MjM0NTwvdGV4dD48L3N2Zz4="
    },
    message: "success"
  })
})

router.post("/api/v1/auth/login", (req, res) => {
  const { username, password } = req.body
  if (username && password) {
    res.json({
      code: 0,
      data: {
        token: `mock-token-${Date.now()}`,
        userInfo: { id: 1, username, roles: ["admin"] }
      },
      message: "登录成功"
    })
  } else {
    res.status(400).json({ code: 400, message: "用户名或密码不能为空" })
  }
})

router.get("/api/v1/users/me", (req, res) => {
  res.json({
    code: 0,
    data: { id: 1, username: "admin", roles: ["admin"], avatar: "" },
    message: "success"
  })
})

router.get("/api/v1/products", (req, res) => {
  res.json({ code: 0, data: db.products, message: "success" })
})

router.post("/api/v1/products", (req, res) => {
  const newId = Math.max(...db.products.map(p => p.id), 0) + 1
  const newProduct = { id: newId, ...req.body }
  db.products.push(newProduct)
  res.json({ code: 0, data: newProduct, message: "新增成功" })
})

router.put("/api/v1/products/:id", (req, res) => {
  const id = Number.parseInt(req.params.id)
  const index = db.products.findIndex(p => p.id === id)
  if (index !== -1) {
    db.products[index] = { ...db.products[index], ...req.body }
    res.json({ code: 0, data: db.products[index], message: "更新成功" })
  } else {
    res.status(404).json({ code: 404, message: "商品不存在" })
  }
})

router.delete("/api/v1/products/:id", (req, res) => {
  const id = Number.parseInt(req.params.id)
  const index = db.products.findIndex(p => p.id === id)
  if (index !== -1) {
    db.products.splice(index, 1)
    res.json({ code: 0, data: null, message: "删除成功" })
  } else {
    res.status(404).json({ code: 404, message: "商品不存在" })
  }
})

router.get("/api/v1/orders", (req, res) => {
  res.json({ code: 0, data: db.orders, message: "success" })
})

router.post("/api/v1/orders", (req, res) => {
  const newId = Math.max(...db.orders.map(o => o.id), 0) + 1
  const newOrder = { id: newId, ...req.body, createTime: new Date().toLocaleString() }
  db.orders.push(newOrder)
  res.json({ code: 0, data: newOrder, message: "新增成功" })
})

router.put("/api/v1/orders/:id", (req, res) => {
  const id = Number.parseInt(req.params.id)
  const index = db.orders.findIndex(o => o.id === id)
  if (index !== -1) {
    db.orders[index] = { ...db.orders[index], ...req.body }
    res.json({ code: 0, data: db.orders[index], message: "更新成功" })
  } else {
    res.status(404).json({ code: 404, message: "订单不存在" })
  }
})

router.delete("/api/v1/orders/:id", (req, res) => {
  const id = Number.parseInt(req.params.id)
  const index = db.orders.findIndex(o => o.id === id)
  if (index !== -1) {
    db.orders.splice(index, 1)
    res.json({ code: 0, data: null, message: "删除成功" })
  } else {
    res.status(404).json({ code: 404, message: "订单不存在" })
  }
})

router.get("/api/v1/users", (req, res) => {
  res.json({ code: 0, data: db.users, message: "success" })
})

router.post("/api/v1/users", (req, res) => {
  const newId = Math.max(...db.users.map(u => u.id), 0) + 1
  const newUser = { id: newId, ...req.body, createTime: new Date().toLocaleString() }
  db.users.push(newUser)
  res.json({ code: 0, data: newUser, message: "新增成功" })
})

router.put("/api/v1/users/:id", (req, res) => {
  const id = Number.parseInt(req.params.id)
  const index = db.users.findIndex(u => u.id === id)
  if (index !== -1) {
    db.users[index] = { ...db.users[index], ...req.body, createTime: db.users[index].createTime }
    res.json({ code: 0, data: db.users[index], message: "更新成功" })
  } else {
    res.status(404).json({ code: 404, message: "用户不存在" })
  }
})

router.delete("/api/v1/users/:id", (req, res) => {
  const id = Number.parseInt(req.params.id)
  const index = db.users.findIndex(u => u.id === id)
  if (index !== -1) {
    db.users.splice(index, 1)
    res.json({ code: 0, data: null, message: "删除成功" })
  } else {
    res.status(404).json({ code: 404, message: "用户不存在" })
  }
})

const app = express()
app.use(express.json())
app.use(router)

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000")
})
