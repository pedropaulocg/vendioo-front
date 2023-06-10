<template>
  <q-layout view="hHh Lpr lFf">
    <q-header class="bg-primary q-py-xs">
      <q-toolbar>
        <q-btn flat
          dense
          round
          @click="drawer = !drawer"
          aria-label="Menu"
          icon="menu" v-if="$q.screen.width < 500">
          <q-tooltip>Menu</q-tooltip>
        </q-btn>
        <q-toolbar-title>
          <q-btn flat
          no-caps
          no-wrap
          dense
          class="q-ml-sm">
          <q-img src="../assets/logo-gestor.svg"
            spinner-color="primary"
            contain
            style="width: 180px" />
        </q-btn>
        </q-toolbar-title>
      <div class="q-gutter-sm row items-center no-wrap">
          <q-avatar color="primary"
            text-color="white"
            size="25px"
            rounded
            class="q-ml-lg">
            <q-tooltip>
              Online
            </q-tooltip>
          </q-avatar>
          <q-btn flat
            no-caps
            ripple
            rounded
            class="bg-padrao btn-rounded text-bold q-mx-sm q-ml-lg">
            <q-icon name="mdi-account"></q-icon>
            <q-menu>
              <q-list style="min-width: 100px">
                <q-item-label header> Olá!</q-item-label>
                <q-item clickable
                  v-close-popup
                  @click="abrirModalUsuario">
                  <q-item-section>Perfil</q-item-section>
                </q-item>
                <q-item clickable
                  v-close-popup
                  @click="efetuarLogout">
                  <q-item-section>Sair</q-item-section>
                </q-item>
                <q-separator />
              </q-list>
            </q-menu>

            <q-tooltip>Usuário</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer
        v-model="drawer"
        show-if-above

        :mini="miniState"
        @mouseover="miniState = false"
        @mouseout="miniState = true"
        mini-to-overlay

        :width="200"
        :breakpoint="500"
        bordered
        class="bg-dark"
      >
        <q-scroll-area class="fit" :horizontal-thumb-style="{ opacity: 0 }">
          <q-list padding class="text-white">
            <EssentialLink v-for="menu in menus" :key="menu.title" v-bind="menu"/>
          </q-list>
        </q-scroll-area>
      </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from 'vue'
import EssentialLink from 'src/components/EssentialLink.vue'

export default defineComponent({
  name: 'MainLayout',

  components: {
    EssentialLink
  },

  setup () {
    return {
      drawer: ref(false),
      miniState: ref(true),
      menus: [
        { title: 'Venda', icon: 'mdi-point-of-sale', routeName: '' },
        { title: 'Dashboard', icon: 'mdi-monitor-dashboard', routeName: '' },
        { title: 'Produtos', icon: 'mdi-package-variant-closed', routeName: 'produtos' },
        { title: 'Agenda', icon: 'mdi-notebook', routeName: 'agenda' }
      ]
    }
  }
})
</script>
