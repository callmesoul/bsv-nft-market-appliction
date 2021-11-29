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
      v-for="topic in store.state.topics"
      :key="topic.key"
      @click="toDetail(topic.key)"
    >
      <img
        class="cover"
        :src="
          topic[
            'coverPicUrl' +
              i18n.locale.value.slice(0, 1).toLocaleUpperCase() +
              i18n.locale.value.slice(1, i18n.locale.value.length)
          ]
        "
      />
      <div class="title">{{ topic.name }}</div>
      <div class="msg flex flex-align-center">
        <div class="creater flex1 flex flex-align-center">
          {{ $t('eventParty') }}:<UserAvatar :metaId="topic.createMetaId" />{{ topic.createName }}
        </div>
        <div class="time">{{ $filters.dateTimeFormat(topic.timestamp, 'YYYY-MM-DD') }}</div>
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
