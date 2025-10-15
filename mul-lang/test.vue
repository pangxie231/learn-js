<script lang="ts" setup>
const router = useRouter()
import TrackEvent from '@/util/tracker'

const openEdit = (contentType: 'details' | 'quick') => {
  contentType == 'details' ? TrackEvent.click_d_strategy_maker() : TrackEvent.click_e_strategy_maker();
  router.push({
    path: '/edit',
    query: {
      handleType: 'add',
      contentType
    }
  })
}

const wrap = ref<HTMLDivElement>()
onClickOutside(wrap, () => {
  router.go(-1)
  console.log('点击空白处')
})
</script>

<template>
  <div pos-relative min-h-100vh bg-dynamic="@/assets/imgs/edit/edit-bg.jpg" @click="hideEdit">
    点击任意空白处关闭
  </div>
</template>