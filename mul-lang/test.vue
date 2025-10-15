<script lang="ts" setup> 
const router = useRouter()
import TrackEvent from '@/util/tracker'

const openEdit = (contentType: 'details' | 'quick')=> {
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
onClickOutside(wrap, ()=> {
  router.go(-1)
  console.log('点击空白处')
})
</script>

<template>
  <div pos-relative min-h-100vh bg-dynamic="@/assets/imgs/edit/edit-bg.jpg" @click="hideEdit">
    <div ref="wrap" pos-absolute bottom-0px bg-dynamic="@/assets/imgs/edit/edit-select-bg.png">
      <span color-white pos-absolute top--50px mx-auto left-0 right-0 text-center block text-24px>{{ $t(点击任意空白处) }}</span>
      <div m-auto flex justify-center items-center mt-50px>
        <img src="@/assets/imgs/edit/title-l.png" bg-dynamic="@/assets/imgs/edit/title-l.png" alt="">
        <span text-30px mx-24px color="#cdb086">{{ $t(发布攻略类型) }}</span>
        <img src="@/assets/imgs/edit/title-r.png" bg-dynamic="@/assets/imgs/edit/title-r.png" alt="">
      </div>
      <div bg-dynamic="@/assets/imgs/edit/type-bg.png" mx-auto mt-50px box-border pt-40px text-24px @click.stop="">
        <div bg-dynamic="@/assets/imgs/edit/btn-yellow.png" mx-auto color="#ffe6a9" grid place-content-center
          @click="openEdit('details')">
          {{ $t(详细攻略发布) }}
        </div>
        <div text-24px color-white text-center mt-30px>
          <p>适合硬核玩家撰写详细攻略内容</p>
          <p>{{ $t(详细攻略不可) }}</p>
        </div>
      </div>
      <div bg-dynamic="@/assets/imgs/edit/type-bg.png" mx-auto mt-50px box-border pt-40px text-24px @click.stop="">
        <div bg-dynamic="@/assets/imgs/edit/btn-red.png" mx-auto color="#f0c9b7" grid place-content-center
          @click="openEdit('quick')">
          {{ $t(快捷攻略发布) }}
        </div>
        <div text-24px color-white text-center mt-30px>
          <p>仅需要上传截图与较少文字即可发布攻略</p>
          <p>{{ $t(你后期也可以) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>