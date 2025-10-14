<script lang="ts" setup>
import TrackEvent from '@/util/tracker'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const tabs = [
  {
    text: '攻略',
    path: '/'
  },
  {
    text: '收藏',
    path: '/collect',
  },
  {
    text: '我的',
    path: '/mine'
  },
]
const tabClasses = {
  normal: ['text-hex-d8d8d8', 'bg-dynamic-@/assets/imgs/home/footer-tab.png'],
  active: ['text-hex-ffe6a9', 'bg-dynamic-@/assets/imgs/home/footer-tab-active.png']
}

const router = useRouter()
const route = useRoute()

const selectedTab = ref(0)

// 根据路由路径更新导航栏状态
const updateSelectedTab = () => {
  const findIndex = tabs.findIndex(tab=> tab.path === route.fullPath)
  if(findIndex >= 0) {
    selectedTab.value = findIndex
    findIndex == 2 && TrackEvent.click_mine()
  }
}

// 初始化正确的路由路径
updateSelectedTab()

// 监听路由变化，动态更新导航栏状态
watch(() => route.fullPath, () => {
  updateSelectedTab()
})

const changeTab = (i: number) => {
  const routePath = tabs[i].path
  router.push(routePath)
  selectedTab.value = i
}
</script>

<template>
  <div>
    <input type="text" placeholder="攻略">
    我的
  </div>
</template>