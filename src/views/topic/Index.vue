<template>
  <InnerPageHeader
    :title="$t('topic')"
    :intro="$t('topicTips')"
    :isShowSearch="false"
    :keyword="keyword"
    @search="search"
  />

  <div class="topic-list container">
    <div
      :to="{ name: 'topicDetail' }"
      class="topic-item"
      v-for="(topic, index) in topics"
      :key="index"
      @click="toDetail(topic.key)"
    >
      <img
        class="cover"
        :src="topic.coverEn ? topic.coverEn : topic.cover"
        v-if="i18n.locale.value === 'en'"
      />
      <img class="cover" :src="topic.cover" v-else />
      <div class="title">{{ topic.name }}</div>
      <div class="msg flex flex-align-center">
        <div class="creater flex1 flex flex-align-center">
          {{ $t('eventParty') }}:<UserAvatar :metaId="topic.createrMetaId" />{{ topic.createrName }}
        </div>
        <div class="time">{{ topic.time }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InnerPageHeader from '@/components/InnerPageHeader/InnerPageHeader.vue'
import { ref } from 'vue-demi'
import { useRouter } from 'vue-router'
import { topics } from '@/config'
import { useI18n } from 'vue-i18n'

const keyword = ref('')
const router = useRouter()
const i18n = useI18n()
function search() {}

function toDetail(key: string) {
  if (key === 'MetaBot') {
    router.push({ name: 'metaBot' })
  } else {
    router.push({ name: 'topicDetail', params: { key } })
  }
}
</script>

<style lang="scss" scoped src="./Index.scss"></style>
