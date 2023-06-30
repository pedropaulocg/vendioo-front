<template>
  <div>
    <Qalendar @updated-period="handleUpdate" @updated-mode="handleUpdate" :events="events" :config="config" :selected-date="new Date()">
      <template #eventDialog="props">
      <q-card v-if="props.eventDialogData && props.eventDialogData.title" >
        <q-card-section>
          <div class="row justify-between">
            <h5 class="q-ma-none"><q-icon name="mdi-circle" :color="props.eventDialogData.color"></q-icon> {{ props.eventDialogData.title }}</h5>
            <div>
              <q-btn icon="mdi-pencil" flat dense @click="editProduct(props.eventDialogData)"/>
              <q-btn icon="mdi-delete" flat dense @click="deleteAgendamento(props.eventDialogData)"/>
            </div>
            <div class="row">
              <div class="q-ma-none text-subtitle1">{{ formatDate(props.eventDialogData.time.start) }}</div>
            </div>
          </div>
          <div class="row items-center">
            <q-icon name="mdi-clock" size="1rem"></q-icon>
            <p class="q-ma-none q-ml-sm">{{ formatHour(props.eventDialogData.time.start) }} - {{ formatHour(props.eventDialogData.time.end) }}</p>
          </div>
          <div class="row items-center">
            <q-icon name="mdi-account" size="1rem"></q-icon>
            <p class="q-ma-none q-ml-sm">{{ props.eventDialogData.with }}</p>
          </div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <p>{{ props.eventDialogData.description }}</p>
        </q-card-section>
      </q-card>
    </template>
    </Qalendar>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn fab icon="add" color="primary" @click="modalState"/>
    </q-page-sticky>
    <ModalCadastroAgendamento :agendamentoSelecionado="agendamentoSelecionado" :isUpdate="isUpdate" :modalAgendamento="modalAgendamento" @modal-state="modalState" @reload-list="listAgendamento"/>
  </div>
</template>

<script>
import { Qalendar } from 'qalendar';
import 'qalendar/dist/style.css';
import { meses } from '../../helper/constants'
import ModalCadastroAgendamento from './ModalCadastroAgendamento.vue';
import { ListAgendamento, DeleteAgendamento } from 'src/services/AppointmenteService';
import { notificarSucesso } from '../../helper/notification';

export default {
  components: {
    Qalendar,
    ModalCadastroAgendamento
  },
  data() {
    return {
      events: [],
      config: {
        week: {
          startsOn: 'monday',
          nDays: 7
        },
        locale: 'pt-BR',
        defaultMode: 'day',
        eventDialog: {
          isCustom: true
        },
        dayIntervals: {
          length: 30,
          height: 80,
          displayClickableInterval: true
        },
        dayBoundaries: {
          start: 6,
          end: 24
        }
      },
      pickedDate: {
        startDate: undefined,
        endDate: undefined
      },
      agendamentoSelecionado: {},
      isUpdate: false,
      modalAgendamento: false
    }
  },
  methods: {
    modalState () {
      this.agendamentoSelecionado = {}
      this.isUpdate = false
      this.modalAgendamento = !this.modalAgendamento
    },
    async listAgendamento () {
      const { data } = await ListAgendamento(this.pickedDate)
      this.events = data.appointments
      this.events = this.events.map(item => {
        const { start, end, ...rest } = item;

        return {
          ...rest,
          time: {
            start: this.formatDateToDB(start).substring(0, 16),
            end: this.formatDateToDB(end).substring(0, 16)
          }
        };
      });
      console.log(this.events);
    },
    deleteAgendamento (agendamento) {
      this.$q.dialog({
        title: 'Cuidado!',
        message: `Essa ação ira deletar o agendamento ${agendamento.title}. Deseja continuar?`,
        cancel: {
          label: 'Não',
          color: 'primary',
          push: true
        },
        ok: {
          label: 'Sim',
          color: 'negative',
          push: true
        },
        persistent: true
      }).onOk(async () => {
        await DeleteAgendamento(agendamento.id)
        await this.listAgendamento()
        notificarSucesso('Agendamento deletado!')
      })
    },
    editProduct (agendamento) {
      this.agendamentoSelecionado = agendamento
      this.isUpdate = true
      this.modalAgendamento = true
    },
    formatDate(date) {
      const [data] = date.split(' ')
      const [ano, mes, dia] = data.split('-')
      return `${dia} de ${meses[parseInt(mes)]} de ${ano}`
    },
    formatHour (date) {
      const [, hour] = date.split(' ')
      return hour
    },
    handleUpdate (payload) {
      let start
      let end
      if (payload.mode) {
        start = this.formatDateToDB(payload.period.start)
        end = this.formatDateToDB(payload.period.end)
      } else {
        start = this.formatDateToDB(payload.start)
        end = this.formatDateToDB(payload.end)
      }
      this.pickedDate = {
        startDate: start,
        endDate: end
      }
      this.listAgendamento()
    },
    formatDateToDB (time) {
      const dateString = time;
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      const hours = ('0' + date.getHours()).slice(-2);
      const minutes = ('0' + date.getMinutes()).slice(-2);
      const offset = date.toString().match(/GMT([+-]\d{4})/)[1];

      return `${year}-${month}-${day} ${hours}:${minutes} ${offset}`;
    }
  },
  mounted () {
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const startHours = '00';
    const endHours = '23';
    const startMinutes = '00';
    const endMinutes = '59';
    const offset = date.toString().match(/GMT([+-]\d{4})/)[1];
    this.pickedDate.startDate = `${year}-${month}-${day} ${startHours}:${startMinutes} ${offset}`
    this.pickedDate.endDate = `${year}-${month}-${day} ${endHours}:${endMinutes} ${offset}`
    this.listAgendamento()
  }
}
</script>

<style>
</style>
