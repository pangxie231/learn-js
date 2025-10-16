<script lang="ts" setup>
import TrackEvent from '@/util/tracker'
import { mapDetailApi, mapListApi } from '@/api/strategy';
import HeroAvatar from '@/components/HeroAvatar.vue';
import { useCommonStore } from '@/store/common';
import type { AddStrategyParams, MapListResponse, StrategyInfo } from '@/types/api';
import type { StrategyTypes } from '@/types/models';
import { showToast, type UploaderAfterRead, type UploaderFileListItem } from 'vant';
// import axios from '@/api/axiosInstance'
import axios from 'axios'
import { checkVideo } from '@/api/strategy'

const staticPrefixUrl = import.meta.env.VITE_STATIC_PREFIX + '/'

// 新增or编辑 handleType
// 快捷or详细 contentType
const route = useRoute()
const router = useRouter()

const commonStore = useCommonStore()
const { editTemp, editForm } = storeToRefs(commonStore)

const routeQuery = route.query as { handleType: 'add' | 'edit', contentType: 'quick' | 'details' }

const handleType = routeQuery.handleType
const contentType = routeQuery.contentType

const isAdd = computed(() => handleType === 'add')
const isQuick = computed(() => contentType === 'quick')

const params = ref({
  map: null,
  hero: [],
  pic: [],
  video: null,
  title: "",
  zbpic: [],
  sqpic: [],
  desc: ''
})

const upLoadItem = {
  normal: 'justify-center flex items-cetner',
}

const equipRef = ref(null)
const artifactRef = ref(null)


// 表单所需要的选项数据
// 地图
const mapData = ref<MapListResponse>()
async function getMapData() {
  try {
    const data = await mapListApi()
    mapData.value = data.data.data
  } catch (error) {
    console.log("🚀 ~ getMapDatap ~ error:", error)
  }
}
getMapData()
const visibleMap = ref(false)
// 点击打开地图弹窗
const chooseMap = () => {
  visibleMap.value = true
}
// 选择地图后
// @ts-ignore
const mapItem = ref<MapItemSub>({
  ...(editTemp.value.mapItem || { id: -1, main: '', sub: '' })
})
const changeMap = async (item: MapItemSub) => {
  TrackEvent.click_choose_your_map()
  mapItem.value = item
  map_id.value = item.id

  const { data } = await mapDetailApi({
    map_id: item.id
  })
  const mapData = data.data


  // @ts-ignore
  editTemp.value.mapItem = {
    ...(mapItem.value || {}),
    detail: mapData.item?.detail,
    length: mapData.item?.length,
    width: mapData.item?.width
  }

}
// 是否选择地图
const isMap = computed(() => map_id.value !== -1)


// 必填项
const requireItems = computed(() => {
  return [
    isMap.value,
    isHeros.value,
    // isImgs.value,
    // isVideos.value,
    isImgs.value || isVideos.value,
    isTitle.value
  ]
})

// 英雄选择
const chooseHero = () => {
  router.push('/search-heros')
}
const handleDelHero = (i: number) => {
  editTemp.value.heros?.splice(i, 1)
}

const selectHeros = () => { }

// 阵型截图上传
// @ts-ignore
const uploadImgs = ref([
  ...(editForm.value.strategy_img_urls?.map(item => ({
    url: item.img_url
  })) || [])
])
const onOversize = () => {
  showToast('文件大小不能超过 5m');
};
const afterRead = async (file: UploaderFileListItem | UploaderFileListItem[]) => {
  // file.status = "uploading";
  // file.message = "上传中...";
  const files = Array.isArray(file) ? file : [file]

  for (const file of files) {
    try {
      const { data } = await uploadFileApi({
        file_name: file.file?.name!
      })
      await axios({
        url: data.data.sign_url,
        method: 'put',
        data: file.file,
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': data.data.mime_type
        }
      })
      // @ts-ignore
      if (!strategy_img_urls.value) strategy_img_urls.value = []
      // 判断是否上传成功前就已经删除了
      if (uploadImgs.value.findIndex(item => item.file === file.file) !== -1) {
        strategy_img_urls?.value?.push({
          img_desc: '',
          img_url: staticPrefixUrl + data.data.key
        })
      }
      // file.status = "done";
      // file.message = "上传成功";
    } catch (error) {
      console.log("🚀 ~ afterRead ~ error:", error)
      //  file.status = "failed";
      // file.message = "上传失败";
    }
  }

}
const onDeleteImg = (file: File, detail: {
  name: number;
  index: number;
}) => {
  strategy_img_urls?.value?.splice(detail.index, 1)
}


// 视频上传
const uploadVideos = ref(
  editForm.value.strategy_video_url ? [{
    url: editForm.value.strategy_video_url || ''
  }] : []
)

const afterReadVideo = async (file: UploaderFileListItem) => {
  try {
    const { data } = await uploadFileApi({
      file_name: file.file?.name!
    })

    await axios({
      url: data.data.sign_url,
      method: 'put',
      data: file.file,
      maxBodyLength: Infinity,
      headers: {
        'Content-Type': data.data.mime_type
      }
    })

    strategy_video_url.value = staticPrefixUrl + data.data.key
  } catch (error) {
    console.log("🚀 ~ afterRead ~ error:", error)
  }
}
const onDeleteVideo = (file: File, detail: {
  name: number;
  index: number;
}) => {
  strategy_video_url.value = ''
}
const onOversizeVideo = () => {
  showToast('文件大小不能超过 10m');
};

// 装备页截图
const uploadImgsEquip = ref([
  ...(editTemp.value.equip_imgs?.map(item => ({
    url: item
  })) || [])
])
const onOversizeEquip = () => {
  showToast('文件大小不能超过 5m');
};
const afterReadEquip = async (file: UploaderFileListItem | UploaderFileListItem[]) => {
   const files = Array.isArray(file) ? file : [file]
   for (const file of files) {

     try {
       await nextTick()
       if (equipRef.value) {
         equipRef.value.scrollLeft = equipRef.value.scrollWidth;
       }
       const { data } = await uploadFileApi({
         file_name: file.file?.name!
       })
       await axios({
         url: data.data.sign_url,
         method: 'put',
         data: file.file,
         maxBodyLength: Infinity,
         headers: {
           'Content-Type': data.data.mime_type
         }
       })
       // @ts-ignore
       if (!editTemp.value.equip_imgs) editTemp.value.equip_imgs = []
       editTemp.value.equip_imgs?.push(staticPrefixUrl + data.data.key)
     } catch (error) {
       console.log("🚀 ~ afterRead ~ error:", error)
     }

   }

}
const onDeleteImgEquip = (file: File, detail: {
  name: number;
  index: number;
}) => {
  editTemp.value.equip_imgs?.splice(detail.index, 1)
}

const checkYtb = async () => {
  try {
    await checkVideo({ video_url: strategy_video_url?.value, video_type: 1 })
    return true
  } catch (err) {
    return false
  }
}



// 神器页截图
const uploadImgsArtifact = ref([
  ...(editTemp.value.artifact_imgs?.map(item => ({
    url: item
  })) || [])
])
const onOversizeArtifact = () => {
  showToast('文件大小不能超过 5m');
};
const afterReadArtifact = async (file: UploaderFileListItem | UploaderFileListItem[]) => {
  const files = Array.isArray(file) ? file : [file]
  for (const file of files) {

    try {
      await nextTick()
      if (artifactRef.value) {
        artifactRef.value.scrollLeft = artifactRef.value.scrollWidth;
      }
      const { data } = await uploadFileApi({
        file_name: file.file?.name!
      })
      await axios({
        url: data.data.sign_url,
        method: 'put',
        data: file.file,
        maxBodyLength: Infinity,
        headers: {
          'Content-Type': data.data.mime_type
        }
      })
      // @ts-ignore
      if (!editTemp.value.artifact_imgs) editTemp.value.artifact_imgs = []
      editTemp.value.artifact_imgs?.push(staticPrefixUrl + data.data.key)
    } catch (error) {
      console.log("🚀 ~ afterRead ~ error:", error)
    }

  }

}
const onDeleteImgArtifact = (file: File, detail: {
  name: number;
  index: number;
}) => {
  editTemp.value.artifact_imgs?.splice(detail.index, 1)
}

// 表单
const defaultForm: StrategyInfo = {
  map_id: -1,
  map_main: '',
  map_sub: '',
  heros: undefined,
  strategy_img_urls: undefined,
  strategy_video_url: '',
  title: '',
  sub_title: '',
  video_info: Array.from({ length: 9 }, () => ({
    title: '',
    video_desc: ''
  })),
  // 版本强势英雄推荐
  hero_desc: '',
  // 通关详细描述
  strategy_desc: ''
}
const formModel = reactive<StrategyInfo>({
  ...defaultForm,
  ...editForm.value
})
watch(() => formModel, (newVal) => {
  editForm.value = { ...newVal }
}, { deep: true })

const { strategy_img_urls, strategy_video_url, title, map_id } = toRefs(formModel)
const isHeros = computed(() => editTemp.value.heros?.length)
const isImgs = computed(() => strategy_img_urls?.value?.length)
const isVideos = computed(() => strategy_video_url?.value)
const isTitle = computed(() => title.value.length)

// 一键解析
const handleParse = async () => {
  TrackEvent.click_upload()
  // 验证必填项，挨个验证
  // 不同的项，需要提示不同的信息

  if (!isMap.value) {
    // TODO
    showToast('请选择地图')
    return
  }

  if (!isHeros.value) {
    // TODO
    showToast('请选择英雄')
    return
  }

  if (!isTitle.value) {
    // TODO
    showToast('请填写阵容标题')
    return
  }

  if (!isImgs.value && !isVideos.value) {
    // TODO
    showToast('请上传阵型截图或传通关视频')
    return
  }

  const videoTrue = await checkYtb()
  if(!videoTrue) {
    showToast('视频地址无效，请上传正确的YouTube视频地址')
    return
  }

  if (editForm.value.title?.length > 15) {
    // TODO
    showToast('阵容标题不能超过15个字')
    return
  }

  // 核心通关策略，不超过500字
  if (editForm.value.strategy_desc?.length > 500) {
    // TODO
    showToast('核心通关策略不能超过500个字')
    return
  }

  editForm.value = formModel


  editTemp.value.heros?.forEach((hero, i) => {
    // 将装备图片填充到数据
    if (editTemp.value.equip_imgs?.length) {

      hero.equip_img = editTemp.value.equip_imgs[i]
    }
    if (editTemp.value.artifact_imgs?.length) {
      // 将神器图片填充到数据
      hero.artifact_img = editTemp.value.artifact_imgs[i]
    }
  })




  editTemp.value.heros = [
    ...(editTemp.value.heros || [])
  ]


  router.push({
    path: '/editor',
    query: {
      handleType,
      contentType
    }
  })
}

const doNotTouch = () => {
  // TODO
  showToast('请进入下一步后修改视频或图片~')
}
</script>

<template>
  <!--  :class="`${type == 'DETAILED' ? 'big' : 'mini'}`" -->
  <div>
    <div bottom-0px box-border class="!h-unset min-h-100vh" @click.stop=""
      bg-dynamic="@/assets/imgs/edit/edit-select-big-bg.png">
      <TopNav :hide-tools="true"></TopNav>
      <!-- 必填 -->
      <div mt-36px>
        <div box-border px-24px flex justify-between items-center>
          <span color="#d0b78f" text-24px>{{$t('必传内容')}}</span>
          <div flex>
            <div v-for="(item, i) in requireItems" :key="i" :class="{
              act: item
            }" w-12px h-12px b-solid b="#d0b78f" b-1px rounded mr-5px>
            </div>

            <!-- <div :class="{
              act: isImgs || isVideos
            }" w-12px h-12px b-solid b="#d0b78f" b-1px rounded mr-5px>
            </div> -->
          </div>
        </div>
        <div bg-dynamic="@/assets/imgs/edit/must-mask.png" box-border p-30px mx-auto mt-20px>
          <!-- 地图选择 -->
          <div flex items-center text-18px justify-center color="#ccc" h-80px bg="#000/34" b-solid b="#66686d" b-1px>
            <div h-full w-130px color="#d0b78f" bg="#393a44" grid place-content-center b-r text-center>
              {{$t('地图选择')}}</div>
            <div @click="chooseMap" h-full grid place-content-center b-x-solid b-x-1 b="#66686d" flex-1 text-center>
              {{ isMap ? (mapItem?.main + '/' + mapItem?.sub) : $t('点击此处选择') }}
            </div>
            <div h-full w-85px flex flex-col items-center justify-center>
              <div h-40px grid place-content-center>
                <div w-12px h-12px b-solid b="#d0b78f" :class="{
                  act: isMap
                }" b-1px rounded></div>
              </div>
              <div h-40px w-85px grid place-content-center b-t-solid b-t-1 b="#66686d">
                {{ Number(isMap) }} / 1
              </div>
            </div>
          </div>

          <!-- 英雄选择 -->
          <div flex items-center text-18px justify-center color="#ccc" h-140px bg="#000/34" b-solid b="#66686d" b-1px
            mt-20px>
            <div h-full w-130px color="#d0b78f" bg="#393a44" grid place-content-center b-r text-center>
              {{$t('英雄选择')}}</div>
            <div @click="chooseHero" h-full b-x-solid b-x-1 b="#66686d" flex-1 overflow-auto>
              <div hfull flex flex-nowrap gap-2px items-center overflow-auto v-if="isHeros">
                <div v-for="(item, i) in editTemp.heros" flex flex-col items-center gap-12px w96px>
                  <div relative w72px h72px b b-solid b-hex-82694f>
                    <img absolute w-full h-full :src="staticPrefixUrl + item.hero_img" alt="">
                    <!-- <div absolute :class="currentItem.flag.classes"></div> -->
                    <!-- <div absolute bg-dynamic="@/assets/imgs/home/hero-bg.png"></div> -->
                    <HeroTag absolute left-0px top-0px :type="item.hero_type" />
                    <div @click.stop="handleDelHero(i)" bg-dynamic="@/assets/imgs/del-items.png" pos-absolute bottom-0
                      right-0></div>
                  </div>
                  <p text-20px text-center texts-ellipsis w-90px>{{ item.hero_name }}</p>
                </div>

              </div>
              <div h-full grid place-content-center text-center v-else>{{ $t('点击此处选择') }}</div>
            </div>
            <div h-full w-85px flex flex-col items-center justify-center>
              <div h-70px grid place-content-center>
                <div w-12px h-12px b-solid b="#d0b78f" :class="{
                  act: isHeros
                }" b-1px rounded></div>
              </div>
              <div h-70px w-85px grid place-content-center b-t-solid b-t-1 b="#66686d">
                {{ editTemp.heros?.length || 0 }} / 15
              </div>
            </div>
          </div>


          <!-- 阵型截图 -->
          <div flex items-center text-18px justify-center color="#ccc" h-160px bg="#000/34" b-solid b="#66686d" b-1px
            mt-20px>
            <div h-full w-130px color="#d0b78f" bg="#393a44" grid place-content-center b-r text-center>
              {{ $t('主阵型截图') }}</div>
            <div flex-1 h-full overflow-auto b-x-solid b-x-1 b="#66686d" px-12px>
              <div h-full flex flex-col justify-center overflow-auto>
                <div flex gap-12px w-max mx-auto>
                  <!-- 自定义上传 上传格式校验 大小校验 自定义上传函数 删除 数据填充 -->
                  <van-uploader class="upload-img" v-model="uploadImgs" :preview-full-image="false"
                    @click-preview="doNotTouch" :after-read="afterRead" @delete="onDeleteImg" multiple :max-count="10"
                    :max-size="1024 * 1024 * 5" accept="image/png, image/jpeg" @oversize="onOversize">
                    <img src="@/assets/imgs/edit/add-img.png" bg-dynamic="@/assets/imgs/edit/add-img.png">
                  </van-uploader>


                </div>
                <p text-center mt--4px>{{ $t('上传本次通关') }}</p>
              </div>
            </div>
            <div h-full w-85px flex flex-col items-center justify-center>
              <div h-80px grid place-content-center>
                <div w-12px h-12px b-solid b="#d0b78f" :class="{
                  act: isImgs
                }" b-1px rounded></div>
              </div>
              <div h-80px w-85px grid place-content-center b-t-solid b-t-1 b="#66686d">
                {{ strategy_img_urls?.length || 0 }} / 10
              </div>
            </div>
          </div>
          <!-- 通关视频 -->
          <div flex items-center text-18px justify-center color="#ccc" h-160px bg="#000/34" b-solid b="#66686d" b-1px
            mt-20px>
            <div h-full w-130px color="#d0b78f" bg="#393a44" grid place-content-center b-r text-center>
              {{ $t('通关视频') }}</div>
            <div h-full grid place-content-center b-x-solid b-x-1 b="#66686d" flex-1 px-25px flex items-center>
              <!-- <van-uploader class="upload-img" v-model="uploadVideos" :preview-full-image="false"
                @click-preview="doNotTouch" :after-read="afterReadVideo" accept="video/mp4,video/webm"
                @delete="onDeleteVideo" @oversize="onOversizeVideo" :multiple="false" :max-count="1"
                :max-size="1024 * 1024 * 10">
                <img src="@/assets/imgs/edit/add-img.png" bg-dynamic="@/assets/imgs/edit/add-img.png">
              </van-uploader> -->
              <!-- TODO -->
              <textarea max-length='15' v-model="strategy_video_url" w='100%' h='50%' resize-none outline-none
                box-border color-white bg='transparent' b-0px block placeholder="填写你本次通关阵容的游戏视频YouTube链接">
              </textarea>
              <!-- <img src="@/assets/imgs/edit/add-video.png" bg-dynamic="@/assets/imgs/edit/add-video.png" block mx-auto> -->
              <!-- {{ $t('上传本次通关阵') }} -->
            </div>
            <div h-full w-85px flex flex-col items-center justify-center>
              <div h-80px grid place-content-center>
                <div w-12px h-12px b-solid b="#d0b78f" :class="{
                  act: isVideos
                }" b-1px rounded></div>
              </div>
              <div h-80px w-85px grid place-content-center b-t-solid b-t-1 b="#66686d">
                {{ strategy_video_url ? 1 : 0 }} / 1
              </div>
            </div>
          </div>
          <!-- 阵容标题 -->
          <div flex items-center text-20px justify-center color="#ccc" h-140px bg="#000/34" b-solid b="#66686d" b-1px
            mt-20px>
            <div h-full w-130px color="#d0b78f" bg="#393a44" grid place-content-center b-r text-center>
              {{ $t('阵容标题') }}</div>
            <div h-full grid place-content-center b-x-solid b-x-1 b="#66686d" flex-1 px-25px flex items-center>
              <!-- 填写你本次阵容的标题，来吸引更多用户 使用/观看你的攻路 -->
              <textarea max-length='15' v-model="title" w='100%' h='50%' resize-none outline-none box-border color-white
                bg='transparent' b-0px block :placeholder="$t('填写你本次阵')">
              </textarea>
            </div>
            <div h-full w-85px flex flex-col items-center justify-center>
              <div h-70px grid place-content-center>
                <div w-12px h-12px b-solid b="#d0b78f" :class="{
                  act: isTitle
                }" b-1px rounded></div>
              </div>
              <div h-70px w-85px grid place-content-center b-t-solid b-t-1 b="#66686d">
                {{ title.length }} / 15
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 非必填 -->
      <div v-if="contentType == 'details'">
        <div box-border px-24px flex justify-between items-center mt-20px>
          <span color="#d0b78f" text-24px>{{ $t('非常推荐你填') }}</span>
          <div color="#ccc" text-20px> {{ $t('非必填') }} </div>
        </div>
        <div bg-dynamic="@/assets/imgs/edit/must-mask-mini.png" box-border p-30px mx-auto>
          <!-- 装备页截图 -->
          <div flex items-center text-18px justify-center pos-relative color="#ccc" h-110px bg="#000/34" b-solid
            b="#66686d" b-1px>
            <div h-full w-130px color="#d0b78f" bg="#393a44" grid place-content-center b-r text-center>
              {{$t('装备页截图')}}</div>
            <div flex-1 overflow-auto h-full flex items-center b-l-solid b-l-1 b="#66686d">
              <!-- <img src="@/assets/imgs/edit/add-icon.png" bg-dynamic="@/assets/imgs/edit/add-icon.png" block mx-auto> -->
              <div flex-1 overflow-auto h-full box-border pt-10px justify-start b-l-solid b-l-1 b="#66686d"
                ref="equipRef" :class="uploadImgsEquip?.length ? '' : upLoadItem.normal">
                <van-uploader class="upload-img2" v-model="uploadImgsEquip" :preview-full-image="false"
                  @click-preview="doNotTouch" :after-read="afterReadEquip" @delete="onDeleteImgEquip" multiple
                  :max-count="15" :max-size="1024 * 1024 * 5" accept="image/png, image/jpeg"
                  @oversize="onOversizeEquip">
                  <!-- <img src="@/assets/imgs/edit/add-img.png" bg-dynamic="@/assets/imgs/edit/add-img.png"> -->
                  <div flex h-90px items-center>
                    <img src="@/assets/imgs/edit/add-icon.png" bg-dynamic="@/assets/imgs/edit/add-icon.png" block
                      mx-auto>
                  </div>
                </van-uploader>
              </div>

            </div>
            <div grid place-content-center b="#66686d" pos-absolute right-5px bottom-5px text-20px>
              {{ editTemp.equip_imgs?.length | 0 }} / 15
            </div>
          </div>
          <!-- 神器页截图 -->
          <div flex items-center text-18px justify-center pos-relative color="#ccc" h-110px bg="#000/34" b-solid
            b="#66686d" b-1px mt-20px>
            <div h-full w-130px color="#d0b78f" bg="#393a44" grid place-content-center b-r text-center>
              {{$t('神器页截图')}}</div>
            <div flex-1 overflow-auto h-full box-border pt-10px b-l-solid b-l-1 b="#66686d" ref="artifactRef"
              :class="uploadImgsArtifact?.length ? '' : upLoadItem.normal">
              <van-uploader class="upload-img2" v-model="uploadImgsArtifact" :preview-full-image="false"
                @click-preview="doNotTouch" :after-read="afterReadArtifact" @delete="onDeleteImgArtifact" multiple
                :max-count="15" :max-size="1024 * 1024 * 5" accept="image/png, image/jpeg"
                @oversize="onOversizeArtifact">
                <!-- <img src="@/assets/imgs/edit/add-img.png" bg-dynamic="@/assets/imgs/edit/add-img.png"> -->
                <div flex h-90px items-center>
                  <img src="@/assets/imgs/edit/add-icon.png" bg-dynamic="@/assets/imgs/edit/add-icon.png" block mx-auto>
                </div>
              </van-uploader>
            </div>
            <div grid place-content-center b="#66686d" pos-absolute right-5px bottom-5px text-20px>
              {{ editTemp.artifact_imgs?.length || 0 }} / 15
            </div>
          </div>
          <!-- 核心通关策略 -->
          <div flex items-center text-18px justify-center pos-relative color="#ccc" h-110px bg="#000/34" b-solid
            b="#66686d" b-1px mt-20px>
            <div h-full w-130px color="#d0b78f" bg="#393a44" grid place-content-center b-r text-center px-10px
              box-border>
              <!-- TODO -->
              核心通关策略</div>
            <div h-full grid place-content-center b-l-solid b-l-1 b="#66686d" flex-1 px-20px flex items-center>
              <!-- TODO -->
              <textarea max-length='15' v-model="formModel.strategy_desc" w='100%' h='55px' resize-none outline-none
                box-border color-white bg='transparent' b-0px block placeholder="描述你的核心通关策略，可以帮助玩家更好的了解你的阵容搭配原因">
              </textarea>
            </div>
            <div grid place-content-center b="#66686d" pos-absolute right-5px bottom-5px text-20px>
              {{ formModel.strategy_desc.length }} / 500
            </div>
          </div>
        </div>
      </div>
      <div @click="handleParse" bg-dynamic="@/assets/imgs/edit/btn-yellow.png" mx-auto color="#ffe6a9" grid
        place-content-center mt-40px text-20px>
        {{ $t('一键上传并解') }}
      </div>
      <div h-40px></div>
    </div>


    <!-- 地图选择 -->
    <mapDialog @change="changeMap" v-model:open="visibleMap" :data-source="(mapData?.items || [])"></mapDialog>
  </div>
</template>


<style lang="postcss" scoped>
.mini {
  height: 1115px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
}

.big {
  height: 100%;
}

.act {
  background-color: #d0b78f;
}

.upload-img {
  margin: 0 auto;

  :deep(.van-uploader__preview-image),
  :deep(.van-uploader__file) {
    width: 161px;
    height: 115px;
  }

  :deep(.van-uploader__preview) {
    margin-bottom: 0;
  }

  :deep(.van-uploader__wrapper) {
    padding: 0 24px;
    flex-wrap: nowrap;
    overflow: auto;
  }
}

.upload-img2 {
  margin: 0 auto;

  :deep(.van-uploader__preview-image),
  :deep(.van-uploader__file) {
    width: 90px;
    height: 90px;
  }

  :deep(.van-uploader__preview) {
    margin-bottom: 0;
  }

  :deep(.van-uploader__wrapper) {
    padding: 0 24px;
    flex-wrap: nowrap;
    overflow: auto;
  }
}
</style>