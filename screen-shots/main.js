import puppeteer from 'puppeteer-core'

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));


const browser = await puppeteer.launch({
  headless: false,
  executablePath: 'D:\\Scoop\\apps\\googlechrome\\current\\chrome.exe'
})

const page = await browser.newPage()
await page.goto('http://127.0.0.1:5173/events/formation/#/en-US/')
await page.evaluate(() => {
  localStorage.setItem('wor-client-international-v2-auth', JSON.stringify({
    "authInfo": {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjo0OSwiem9uZUlkIjoiNDAwMDEiLCJyb2xlSWQiOiIxMjEyNCIsIm5hbWUiOiJhc2E0NTQxIiwiZXhwIjoxNzY2MjAwMzQwfQ.nu2dTD2KLkkD-NGHCvzRCfWcPAswjJgfZmN5N5sR1UY",
      "expiresAt": 1766200340
    }
  }))

  localStorage.setItem('wor-client-international-v2-common', JSON.stringify({
    editForm: {
      "map_id": 38,
      "strategy_img_urls": [{
        "img_url": "https://akm.outweb-strategyguide.watcherofrealms.com/wor-strategy/upload/2025-12-17/b5b9e887-b202-4099-a734-c788392d25c2.png",
        "img_desc": ""
      }],
      "strategy_video_url": "",
      "video_info": [{
        "title": "",
        "video_desc": ""
      }, {
        "title": "",
        "video_desc": ""
      }, {
        "title": "",
        "video_desc": ""
      }, {
        "title": "",
        "video_desc": ""
      }, {
        "title": "",
        "video_desc": ""
      }, {
        "title": "",
        "video_desc": ""
      }, {
        "title": "",
        "video_desc": ""
      }, {
        "title": "",
        "video_desc": ""
      }, {
        "title": "",
        "video_desc": ""
      }],
      "title": "帅气 的标题，看看截图",
      "sub_title": "看看副标题",
      "hero_desc": "",
      "strategy_desc": "一嘻嘻嘻",
      "tags": null,
      "ref_id": 260,
      "ref_user_name": "无敌大白熊",
      "ref_user_header_img": "wor-strategy/avatar/1.png"
    },
    editTemp: {
      heros: [
      //   {
      //   "hero_id": 60,
      //   "hero_name": "Cuke",
      //   "hero_img": "strategy/Hero/173200321318143503-4c95-4698-b6c1-a7497c8c9547.png",
      //   "hero_type": 1,
      //   "hero_cate": 2,
      //   "strategy_id": 260,
      //   "backup_heros": null,
      //   "backup_hero_resp": null,
      //   "equip_img": "https://akm.outweb-strategyguide.watcherofrealms.com/wor-strategy/upload/2025-12-17/f8d7f28e-58ee-44ca-a7fb-8fe18062430f.png",
      //   "artifact_img": "https://akm.outweb-strategyguide.watcherofrealms.com/wor-strategy/upload/2025-12-17/73109f95-172f-4b7d-b4d7-00b7d963ce18.png",
      //   "hero_desc": "",
      //   "left_equip_id": 0,
      //   "left_equip_name": "",
      //   "left_equip_img": "",
      //   "right_equip_id": 0,
      //   "right_equip_name": "",
      //   "right_equip_img": "",
      //   "artifact_id": 0,
      //   "artifact_name": "",
      //   "artifact_brief_img": "",
      //   "replace_artifact_id": 0,
      //   "replace_artifact_name": "",
      //   "replace_artifact_brief_img": "",
      //   "hero_tags": null,
      //   "order": 1,
      //   "face_index": 3
      // }, {
      //   "hero_id": 30,
      //   "hero_name": "Maul",
      //   "hero_img": "strategy/Hero/17320016233f8c269b-2bd4-42ca-ac55-ac8993dbe683.png",
      //   "hero_type": 1,
      //   "hero_cate": 2,
      //   "strategy_id": 260,
      //   "backup_heros": null,
      //   "backup_hero_resp": null,
      //   "equip_img": "https://akm.outweb-strategyguide.watcherofrealms.com/wor-strategy/upload/2025-12-17/bc5e8235-9e5c-4150-86db-3f5f31419cf6.png",
      //   "artifact_img": "https://akm.outweb-strategyguide.watcherofrealms.com/wor-strategy/upload/2025-12-17/106544ce-d81f-4550-9f7e-01cd5a47472b.png",
      //   "hero_desc": "",
      //   "left_equip_id": 0,
      //   "left_equip_name": "",
      //   "left_equip_img": "",
      //   "right_equip_id": 0,
      //   "right_equip_name": "",
      //   "right_equip_img": "",
      //   "artifact_id": 0,
      //   "artifact_name": "",
      //   "artifact_brief_img": "",
      //   "replace_artifact_id": 0,
      //   "replace_artifact_name": "",
      //   "replace_artifact_brief_img": "",
      //   "hero_tags": null,
      //   "order": 2,
      //   "face_index": 2
      // }
    ]
    }
  }))
})
await page.goto('http://127.0.0.1:5173/events/formation/#/en-US/editor?handleType=add&contentType=details')
await page.reload({
  waitUntil: 'domcontentloaded'
})

await page.setViewport({
  width: 1920,
  height: 1080,
  deviceScaleFactor: await page.evaluate(() => window.devicePixelRatio),
});



// 选择主关卡
for (let i of new Set([0, 1, 2])) {

  // 选择难度
  for (let i2 of new Set([1, 0])) {

    const subMaps = new Map([
      [1, Array.from({
        length: 15
      }, (_, i) => i)],
      [0, Array.from({
        length: 9
      }, (_, i) => i)]
    ])
    // 
    for (let i3 of subMaps.get(i2)) {
      await sleep(500)
      await page.waitForSelector('#headlessui-tabs-panel-v-0 > div > div:nth-child(1) > div:nth-child(2)')
      const switchMap = await page.$('#headlessui-tabs-panel-v-0 > div > div:nth-child(1) > div:nth-child(2)')
      // 点击切换地图
      await switchMap.click()

      // 选中关卡类型
      await page.waitForSelector('#headlessui-portal-root > div > div > div > div.fixed.inset-0.w-screen.mx-auto.flex.justify-center.items-center > div > div > div > div:nth-child(1) > div:nth-child(1) > button:nth-child(3)')
      const mapType = await page.$('#headlessui-portal-root > div > div > div > div.fixed.inset-0.w-screen.mx-auto.flex.justify-center.items-center > div > div > div > div:nth-child(1) > div:nth-child(1) > button:nth-child(3)')
      await mapType.click()


      await page.waitForSelector(`#headlessui-portal-root > div > div > div > div.fixed.inset-0.w-screen.mx-auto.flex.justify-center.items-center > div > div > div > div:nth-child(1) > div > div:nth-child(${i + 1})`)
      const mapItem = await page.$(`#headlessui-portal-root > div > div > div > div.fixed.inset-0.w-screen.mx-auto.flex.justify-center.items-center > div > div > div > div:nth-child(1) > div > div:nth-child(${i + 1})`)
      // 选中主图
      await mapItem.click()


      const confirmBtn = await page.$('#headlessui-portal-root > div > div > div > div.fixed.inset-0.w-screen.mx-auto.flex.justify-center.items-center > div > div > div > div:nth-child(3) > button:nth-child(2)')
      // 确认选中
      await confirmBtn.click()

      await page.waitForSelector(`#headlessui-portal-root > div:nth-child(2) > div > div > div.fixed.inset-0.w-screen.mx-auto.flex.justify-center.items-center > div > div > div > div:nth-child(1) > div:nth-child(1) > button:nth-child(${i2 + 1})`)
      const diffcult = await page.$(`#headlessui-portal-root > div:nth-child(2) > div > div > div.fixed.inset-0.w-screen.mx-auto.flex.justify-center.items-center > div > div > div > div:nth-child(1) > div:nth-child(1) > button:nth-child(${i2 + 1})`)
      await diffcult.click()

      await page.waitForSelector(`#headlessui-portal-root > div:nth-child(2) > div > div > div.fixed.inset-0.w-screen.mx-auto.flex.justify-center.items-center > div > div > div > div:nth-child(1) > div > div:nth-child(${i3 + 1})`)
      const subMapItem = await page.$(`#headlessui-portal-root > div:nth-child(2) > div > div > div.fixed.inset-0.w-screen.mx-auto.flex.justify-center.items-center > div > div > div > div:nth-child(1) > div > div:nth-child(${i3 + 1})`)
      // 选中子图
      await subMapItem.click()

      const confirmBtn2 = await page.$('#headlessui-portal-root > div:nth-child(2) > div > div > div.fixed.inset-0.w-screen.mx-auto.flex.justify-center.items-center > div > div > div > div:nth-child(4) > button:nth-child(2)')
      // 确认选中
    
      await confirmBtn2.click()


      await page.waitForSelector('#headlessui-tabs-panel-v-0 > div > div:nth-child(2) > div:nth-child(1) > div:nth-child(1)')
      await sleep(200)
      const ele = await page.$('#headlessui-tabs-panel-v-0 > div > div:nth-child(2)')
      // 截图
      await ele.screenshot({
        path: `imgs/Gear Raid${i + 1}-Stage${i2 === 1 ? (i3 + 1) : (i3 + 1 + 15)}.png`
      })
    }
  }
}

// 选择难度
// 选择子关卡

// await page.waitForSelector('#headlessui-portal-root > div > div > div > div.fixed.inset-0.w-screen.mx-auto.flex.justify-center.items-center > div > div > div > div:nth-child(1) > div > div')
// const mapItem = await page.$('#headlessui-portal-root > div > div > div > div.fixed.inset-0.w-screen.mx-auto.flex.justify-center.items-center > div > div > div > div:nth-child(1) > div > div')
// // 选中主图
// await mapItem.click()

// const confirmBtn = await page.$('#headlessui-portal-root > div > div > div > div.fixed.inset-0.w-screen.mx-auto.flex.justify-center.items-center > div > div > div > div:nth-child(3) > button:nth-child(2)')
// // 确认选中
// await confirmBtn.click()

// await page.waitForSelector('#headlessui-portal-root > div:nth-child(2) > div > div > div.fixed.inset-0.w-screen.mx-auto.flex.justify-center.items-center > div > div > div > div:nth-child(1) > div > div')
// const subMapItem = await page.$('#headlessui-portal-root > div:nth-child(2) > div > div > div.fixed.inset-0.w-screen.mx-auto.flex.justify-center.items-center > div > div > div > div:nth-child(1) > div > div')
// // 选中子图
// await subMapItem.click()

// const confirmBtn2 = await page.$('#headlessui-portal-root > div:nth-child(2) > div > div > div.fixed.inset-0.w-screen.mx-auto.flex.justify-center.items-center > div > div > div > div:nth-child(4) > button:nth-child(2)')
// // 确认选中
// await confirmBtn2.click()

// await page.setViewport({
//   width: 1920,
//   height: 1080,
//   deviceScaleFactor: await page.evaluate(() => window.devicePixelRatio),
// });

// await page.waitForSelector('#headlessui-portal-root > div:nth-child(2) > div > div > div.fixed.inset-0.w-screen.mx-auto.flex.justify-center.items-center > div > div > div > div:nth-child(4) > button:nth-child(2)', {
//   hidden: true
// })

// const ele = await page.$('#headlessui-tabs-panel-v-0 > div > div:nth-child(2)')
// // 截图
// await ele.screenshot({
//   path: '01.png'
// })