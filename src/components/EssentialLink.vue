<template>
  <q-item
    clickable
    v-ripple
    :active="routeName == cRouterName"
    active-class="bg-primary text-white text-bold menu-link-active-item-top"
    @click=" () => !(routeName == cRouterName) ? $router.push({ name: routeName }) : ''"
    class="houverList"
  >
    <q-item-section
      v-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <!-- <q-item-label caption>
        {{ caption }}
      </q-item-label> -->
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: 'EssentialLink',
  data () {
    return {
      menuAtivo: 'dashboard'
    }
  },
  props: {
    title: {
      type: String,
      required: true
    },

    caption: {
      type: String,
      default: ''
    },

    color: {
      type: String,
      default: ''
    },

    routeName: {
      type: String,
      default: 'dashboard'
    },

    icon: {
      type: String,
      default: ''
    }
  },
  computed: {
    cRouterName () {
      return this.$route.name
    }
  }
}
</script>
<style lang="sass">
.menu-link-active-item-top
  border-left: 4px solid rgb(21, 120, 173)
  // border-radius: 20px
  border-top-right-radius: 20px
  border-bottom-right-radius: 20px
  position: relative
  height: 100%
</style>
