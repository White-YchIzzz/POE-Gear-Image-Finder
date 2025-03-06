<script setup lang="ts">
import { ref, onMounted } from 'vue'

const gearName = ref('')
const gearsData = ref<any>([])
const searchResult = ref<any>([])
const imgSrc = ref('')
const activeName = ref('')

const getGearsData = async () => {
  gearsData.value = await window.api.invoke('get-gears')
}

onMounted(() => {
  getGearsData()
})

const handleInputGearName = (gearName: string) => {
  if (gearName === '') {
    searchResult.value = []
    return
  }
  const lowerCaseGearName = gearName.toLowerCase()

  searchResult.value = gearsData.value.filter((item) =>
    item.name.toLowerCase().includes(lowerCaseGearName)
  )
}

const handleItemClick = (gearInfo: any) => {
  activeName.value = gearInfo.name
  imgSrc.value = gearInfo.icon
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
              :key="item.name"
              :class="{ selected: item.name === activeName }"
              @click="handleItemClick(item)"
            >
              {{ item.name }}
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
