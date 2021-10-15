<template>
  <UserCenter :user="user" :userInfoLoading="loading" ref="root"></UserCenter>
</template>

<script setup lang="ts">
import { GetMetaIdInfo } from '@/api'
import UserCenter from '@/components/UserCenter/UserCenter.vue'
import { onMounted, reactive, ref } from 'vue-demi'
import { useRoute } from 'vue-router'
const root = ref()
const user = reactive({
  name: '',
  metaId: '',
})
const loading = ref(true)
const route = useRoute()

onMounted(async () => {
  if (route.params.metaId && typeof route.params.metaId === 'string') {
    const res = await GetMetaIdInfo(route.params.metaId)
    if (res.code === 200) {
      user.name = res.result.name
      user.metaId = res.result.metaId
      root.value.changeTabIndex(1)
      loading.value = false
    }
  }
})
</script>

<style lang="scss" scoped></style>
