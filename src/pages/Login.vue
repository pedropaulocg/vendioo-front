<template>
  <q-layout class="row">
    <div class="col-4 bg-primary">
      <div class="row justify-center q-mt-xl">
        <img src="../assets/logo-gestor.svg" style="width: 290px; height: 100px"/>
      </div>
      <div class="flex column justify-center items-center q-mt-lg q-mb-xl">
        <q-card style="width: 180px; margin-left: -160px;" class="q-pa-sm">
          <q-card-section>
            <q-icon name="mdi-finance" size="3rem"></q-icon>
            <h6 class="q-pa-none q-ma-none">Lucro</h6>
            <h5 class="q-pa-none q-ma-none text-weight-bolder" style="color: #1b48e8">R$ 2000</h5>
          </q-card-section>
        </q-card>
        <q-card style="width: 200px; margin-right: -120px; margin-top: -50px; z-index: 1;" class="q-pa-sm">
          <q-card-section>
            <q-icon name="mdi-calendar-clock" size="3rem"></q-icon>
            <h6 class="q-pa-none q-ma-none">Agendamentos</h6>
            <h5 class="q-pa-none q-ma-none text-weight-bolder" style="color: #1b48e8">10 para hoje</h5>
          </q-card-section>
        </q-card>
        <q-card style="width: 240px; margin-left: -220px; margin-top: -50px" class="q-pa-lg">
          <q-card-section class="flex justify-center">
            <q-icon name="mdi-cash-register" size="3rem"></q-icon>
            <h6 class="q-pa-none q-ma-none"></h6>
            <h5 class="q-pa-none q-ma-none text-weight-bolder" style="color: #1b48e8">Nova venda +</h5>
          </q-card-section>
        </q-card>
      </div>
      <div class="q-mt-xl q-pa-lg flex column justify-center items-center">
        <div>
          <h4 class="text-bold text-white q-mb-none">Seja bem vindo(a)</h4>
          <div class="text-subtitle1 text-white">Comece a organizar suas vendas de maneira rápida e eficaz</div>
          <div class="text-subtitle1 text-white">Entre em contato conosco e de o primeiro passo para crescer</div>
          <q-btn class="q-mt-md text-bold" style="background-color: #979cb0;" icon="mdi-forum" label="FALE COM A GENTE"/>
        </div>
      </div>
    </div>
    <div class="col-8 row justify-center items-center">
      <div style="width: 30%; min-width: 300px">
        <h4 class="text-bold text-primary q-mb-md">Ja tem uma conta?</h4>
        <div class="text-subtitle1 text-primary q-mb-md">Faça o login e comece a vender!</div>
        <q-input placeholder="seu@email.com" :error="v$.email.$error" v-model="email" class="" filled label="Email" @keyup.enter="login">
          <template v-slot:prepend>
            <q-icon name="mdi-at"></q-icon>
          </template>
        </q-input>
        <q-input class="" filled label="Senha" :error="v$.password.$error" v-model="password" type="password" @keyup.enter="login">
          <template v-slot:prepend>
            <q-icon name="mdi-lock"></q-icon>
          </template>
        </q-input>
        <q-btn color="primary" class="full-width q-mt-lg q-pa-sm" label="LOGIN" @click="login"/>
      </div>
    </div>
  </q-layout>
</template>

<script>
import { required, email, minLength } from '@vuelidate/validators'
import useValidate from '@vuelidate/core'
import { Login } from '../services/UserService'
import { notificarSucesso } from '../helper/notification'
export default {
  data() {
    return {
      v$: useValidate(),
      email: '',
      password: ''
    };
  },
  validations() {
    return {
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(6)
      }
    }
  },
  computed: {
    contadorDuplicado() {
      return this.contador * 2;
    }
  },
  methods: {
    async login() {
      this.v$.$touch()
      if (this.v$.$error) {
        this.$q.notify('Informe usuário e senha corretamente.')
        return 0
      }
      const login = {
        email: this.email,
        password: this.password
      }
      try {
        const { data } = await Login(login)
        localStorage.setItem('token', JSON.stringify(data.token))
        localStorage.setItem('username', JSON.stringify(data.username))
        this.$router.push('/')
        notificarSucesso('Login realizado! Seja bem vindo')
      } catch (e) {
        console.log(e)
      }
    }
  }
};
</script>

<style>

</style>
