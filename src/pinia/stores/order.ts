import { defineStore } from "pinia"
import { ref } from "vue"

export interface Order {
  id: number
  productId: number
  productName: string
  price: number // 单价
  quantity: number
  totalAmount: number
  userName: string
  status: "待处理" | "已发货" | "已完成"
  createTime: string
}

export const useOrderStore = defineStore(
  "order",
  () => {
    const orders = ref<Order[]>([
      {
        id: 1,
        productId: 1,
        productName: "苹果",
        price: 5,
        quantity: 2,
        totalAmount: 10,
        userName: "张三",
        status: "待处理",
        createTime: "2025-04-01 10:00"
      },
      {
        id: 2,
        productId: 2,
        productName: "香蕉",
        price: 3,
        quantity: 1,
        totalAmount: 3,
        userName: "李四",
        status: "已发货",
        createTime: "2025-04-02 14:30"
      }
    ])

    // 新增订单
    function addOrder(order: Omit<Order, "id" | "createTime">) {
      const newId = Math.max(...orders.value.map(o => o.id), 0) + 1
      const newOrder: Order = {
        ...order,
        id: newId,
        createTime: new Date().toLocaleString()
      }
      orders.value.push(newOrder)
    }

    // 更新订单状态
    function updateOrderStatus(orderId: number, status: Order["status"]) {
      const order = orders.value.find(o => o.id === orderId)
      if (order) {
        order.status = status
      }
    }

    // 删除订单
    function deleteOrder(orderId: number) {
      const index = orders.value.findIndex(o => o.id === orderId)
      if (index !== -1) {
        orders.value.splice(index, 1)
      }
    }

    return { orders, addOrder, updateOrderStatus, deleteOrder }
  },
  {
    persist: true
  }
)
