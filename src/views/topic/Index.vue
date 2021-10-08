<template>
  <InnerPageHeader
    :title="$t('topic')"
    :intro="$t('topicTips')"
    :keyword="keyword"
    @search="search"
  />

  <div class="topic-list container">
    <router-link
      :to="{ name: 'topicDetail' }"
      class="topic-item"
      v-for="(topic, index) in topics"
      :key="index"
    >
      <img class="cover" :src="topic.cover" />
      <div class="title">{{ topic.name }}</div>
      <div class="msg flex flex-align-center">
        <div class="creater flex1 flex flex-align-center">
          {{ $t('eventParty') }}:<UserAvatar :metaId="topic.createrMetaId" />{{ topic.createrName }}
        </div>
        <div class="time">{{ topic.time }}</div>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import InnerPageHeader from '@/components/InnerPageHeader/InnerPageHeader.vue'
import { ref } from 'vue-demi'
import yadiannaBanner from '@/assets/images/banner_yadianna.jpg'
import metabotBanner from '@/assets/images/banner_metabot.jpg'

const topics = [
  {
    cover: yadiannaBanner,
    name: 'Bitcoin SV Athena Astronaut 雅典娜',
    createrMetaId: '',
    createrName: '₿itcoin A Studio',
    time: '2021-10-08',
  },
  {
    cover: metabotBanner,
    name: 'MetaID首个头像NFT-MetaBot',
    createrMetaId: '974e2977d5c9446f7f48fd82c9ea51f82749b9ef7c00d26b73bc450d167d5f31',
    createrName: 'ShowPayTeam',
    time: '2021-09-08',
  },
]
const keyword = ref('')

function search() {}
</script>

<style lang="scss" scoped src="./Index.scss"></style>
