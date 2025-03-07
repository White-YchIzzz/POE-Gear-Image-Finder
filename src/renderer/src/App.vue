<script setup lang="ts">
import { ref, onMounted, reactive, shallowRef } from 'vue'
import { debounce } from 'lodash'

const gearName = ref('')
const gearsData = shallowRef<any>([])
const searchResult = shallowRef<any>([])
const imgSrc = ref('')
const activeName = ref('')
const uniqueMap = reactive<Map<string, any>>(new Map())

const getGearsData = async () => {
  gearsData.value = await window.api.invoke('get-gears')

  gearsData.value.forEach((item: any) => {
    const chinese = item.chinese
    uniqueMap.set(chinese, item)
  })
}

onMounted(() => {
  getGearsData()
})

const handleInputGearName = debounce((gearName: string) => {
  if (gearName === '') {
    searchResult.value = []
    return
  }
  const _gearName = gearName.trim()

  searchResult.value = Array.from(uniqueMap.entries())
    .filter(([key]) => key.includes(_gearName))
    .map(([, value]) => value)
}, 300)

const handleItemClick = (gearInfo: any) => {
  activeName.value = gearInfo.chinese
  imgSrc.value = gearInfo.image
}

const downloadImage = async () => {
  if (!imgSrc.value) return

  try {
    const fileName = `${activeName.value || 'gear'}.png`
    await window.api.invoke('download-image', {
      url: imgSrc.value,
      filename: fileName
    })

    await window.api.invoke('show-dialog', {
      type: 'info',
      title: '下载完成',
      message: '文件已保存到下载目录',
      buttons: ['确定']
    })
  } catch (err) {
    console.error('下载失败:', err)
    alert('下载失败，请检查控制台日志')
  }
}
</script>

<template>
  <div class="container">
    <div class="input-container">
      <div class="text">Input <span class="vue">Gear</span> Name</div>
      <div class="input" style="position: relative">
        <input
          v-model="gearName"
          class="gears-input"
          type="text"
          placeholder="Gear Name"
          @input="handleInputGearName(gearName)"
        />
        <div v-if="searchResult.length > 0" class="dropdown">
          <ul>
            <li
              v-for="item in searchResult"
              :key="item.chinese"
              :class="{ selected: item.chinese === activeName }"
              @click="handleItemClick(item)"
            >
              {{ item.chinese }}
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div class="gear-iamge-wrapper">
      <img v-if="imgSrc" class="gear-image" :src="imgSrc" @click="downloadImage" />
    </div>
  </div>
</template>
