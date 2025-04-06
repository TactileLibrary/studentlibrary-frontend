<script setup lang="ts">
import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import SidebarComponent from '../components/SidebarComponent.vue'

import MembersTab from '../components/MembersTab.vue'

import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
const route = useRoute()

const groupId = ref(route.params.id)

watch(
  () => route.params.id,
  (newId) => {
    groupId.value = newId
  },
)
</script>

<template>
  <SidebarComponent />

  <Tabs value="0" class="h-full w-full">
    <TabList>
      <Tab value="0">Activities</Tab>
      <Tab value="1">Members </Tab>
    </TabList>
    <TabPanels>
      <TabPanel value="0"> </TabPanel>
      <TabPanel value="1"><MembersTab :id="groupId" /></TabPanel>
    </TabPanels>
  </Tabs>
</template>
