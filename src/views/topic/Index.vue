<template>
  <InnerPageHeader
    :title="$t('topic')"
    :intro="$t('topicTips')"
    :isShowSearch="false"
    :isHasBackIcon="false"
    :keyword="keyword"
    @search="search"
  />

  <div class="topic-list container">
    <div
      :to="{ name: 'topicDetail' }"
      class="topic-item"
      v-for="topic in store.state.topics"
      :key="topic.key"
      @click="toDetail(topic.key, topic.createMetaId)"
    >
      <img class="cover" :src="$filters.getI18nContent(topic, 'coverPicUrl')" />

      <div class="msg">
        <div class="title">{{ topic.name }}</div>
        <div class="time">
          {{ $t('issueDate') }}: {{ $filters.dateTimeFormat(topic.timestamp, 'YYYY-MM-DD') }}
        </div>
        <div class="creater flex1 flex flex-align-center">
          {{ $t('eventParty') }}:<UserAvatar :metaId="topic.createMetaId" />{{ topic.createName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import InnerPageHeader from '@/components/InnerPageHeader/InnerPageHeader.vue'
import { ref } from 'vue-demi'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useStore } from '@/store'

const keyword = ref('')
const router = useRouter()
const i18n = useI18n()
const store = useStore()
const mode = import.meta.env.MODE

function search() {}

function toDetail(key: string, metaId: string) {
  // router.push({ name: 'topicDetail', params: { key, metaId } })
  if (key === 'MetaBot') {
    router.push({ name: 'metaBot' })
  } else {
    router.push({ name: 'topicDetail', params: { key, metaId } })
  }
}
</script>

<style lang="scss" scoped src="./Index.scss"></style>
