<template>
  <div>
    <q-dialog :model-value="modalAgendamento" persistent>
      <q-card style="max-width: 600px">
        <q-card-section class="bg-primary q-mb-md">
          <div class="text-h6 text-white">Cadastrar Agendamento</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row items-center q-col-gutter-md">
            <div class="col-8">
              <q-input label="Titulo*" v-model="agendamento.title" :error="v$.agendamento.title.$error"/>
            </div>
            <div class="col-4">
              <q-select label="Funcionário*" dense v-model="agendamento.with"/>
            </div>
            <div class="col-8 col-md-3">
              <q-input dense v-model="date" mask="##/##/####" :disable="today" :error="v$.date.$error">
                <template v-slot:append>
                  <q-icon name="mdi-calendar" color="primary" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-date v-model="date">
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Ok" color="primary" flat />
                        </div>
                      </q-date>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-4 col-md-2 q-pr-none">
              <q-checkbox label="Hoje" v-model="today"/>
            </div>
            <div class="col-3">
              <q-input dense v-model="startTime" mask="time" :error="v$.startTime.$error">
                <template v-slot:append>
                  <q-icon name="mdi-clock" color="primary" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="startTime" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Ok" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-1 q-pr-none">Ate</div>
            <div class="col-3">
              <q-input dense v-model="endTime" mask="time" :error="v$.endTime.$error">
                <template v-slot:append>
                  <q-icon name="mdi-clock" color="primary" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-time v-model="endTime" format24h>
                        <div class="row items-center justify-end">
                          <q-btn v-close-popup label="Ok" color="primary" flat />
                        </div>
                      </q-time>
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
            <div class="col-12">
              <q-input
                label="Descrição"
                dense
                maxlength="255"
                type="textarea"
                v-model="agendamento.description"
              />
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" @click="closeModal()"/>
          <q-btn label="Salvar" color="primary" @click="saveAgendamento" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    </div>
</template>

<script>
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core';
import { notificarErro, notificarSucesso } from '../../helper/notification';
import { CreateAgendamento } from '../../services/AppointmenteService'

export default {
  props: {
    modalAgendamento: {
      type: Boolean,
      default: false
    },
    agendamentoSelecionado: {
      type: Object,
      default: () => {}
    },
    isUpdate: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      v$: useVuelidate(),
      agendamento: {
        title: undefined,
        start: undefined,
        end: undefined,
        description: undefined,
        with: undefined
      },
      date: undefined,
      startTime: undefined,
      endTime: undefined,
      today: false
    }
  },
  validations() {
    return {
      agendamento: {
        title: {
          required
        }
      },
      date: { required },
      startTime: { required },
      endTime: { required }
    }
  },
  methods: {
    async saveAgendamento () {
      this.v$.$touch()
      if (this.v$.$error) {
        notificarErro('Campos inválidos')
        return
      }
      const [dia, mes, ano] = this.date.split('/')
      this.agendamento.start = `${ano}-${mes}-${dia} ${this.startTime}`
      this.agendamento.end = `${ano}-${mes}-${dia} ${this.endTime}`
      if (this.isUpdate) {
        console.log
      } else {
        await CreateAgendamento(this.agendamento);
        notificarSucesso('Agendamento marcado!')
      }
      this.$emit('reload-list')
      this.$emit('modal-state')
    },
    resetModel () {
      this.agendamento = {
        title: undefined,
        start: undefined,
        end: undefined,
        color: undefined,
        description: undefined,
        with: undefined
      }
      this.date = undefined
      this.startTime = undefined
      this.endTime = undefined
      this.today = false
      this.v$.$reset()
    },
    closeModal () {
      this.resetModel()
      this.$emit('modal-state')
    }
  },
  watch: {
    agendamentoSelecionado (val) {
      if (this.isUpdate) {
        this.agendamento = {
          title: this.agendamentoSelecionado.title,
          description: this.agendamentoSelecionado.description,
          with: this.agendamentoSelecionado.with
        }
        const [date, startTime] = this.agendamentoSelecionado?.time.start.split(' ')
        const [, endTime] = this.agendamentoSelecionado?.time.end.split(' ')
        const [year, month, day] = date.split('-')
        this.date = `${day}/${month}/${year}`
        this.startTime = startTime
        this.endTime = endTime
      } else {
        this.resetModel()
      }
    },
    today (val) {
      if (val) {
        const dateObj = new Date()
        const day = ('0' + dateObj.getDate()).slice(-2);
        const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
        const year = dateObj.getFullYear();

        this.date = `${day}/${month}/${year}`;
      } else {
        this.date = undefined
      }
    }
  }
}
</script>

<style>
</style>
