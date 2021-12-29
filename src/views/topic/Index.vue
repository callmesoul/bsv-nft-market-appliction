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
      @click="toDetail(topic.key, topic.createMetaId)"
    >
      <img class="cover" :src="$filters.getI18nContent(topic, 'coverPicUrl')" />
      <div class="title">{{ topic.name }}</div>
      <div class="msg flex flex-align-center">
        <div class="creater flex1 flex flex-align-center">
          {{ $t('eventParty') }}:<UserAvatar :metaId="topic.createMetaId" />{{ topic.createName }}
        </div>
        <div class="time">{{ $filters.dateTimeFormat(topic.timestamp, 'YYYY-MM-DD') }}</div>
      </div>
    </div>

    <div
      class="topic-item"
      key="soul"
      @click="toDetail('soul', 'f071580414e3a6ce87952b7b7cc66c7c4f35709ff1edd66b88fa1a308c14d6d7')"
    >
      <img
        class="cover"
        src="http://filecdn.showpay.top/nos/topic/Webot%202022%20Revenue%20NFT%20Sale.png"
      />
      <div class="title">soul</div>
      <div class="msg flex flex-align-center">
        <div class="creater flex1 flex flex-align-center">
          {{ $t('eventParty') }}:<UserAvatar
            metaId="f071580414e3a6ce87952b7b7cc66c7c4f35709ff1edd66b88fa1a308c14d6d7"
          />
          soul
        </div>
        <div class="time">2021-05-05</div>
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
