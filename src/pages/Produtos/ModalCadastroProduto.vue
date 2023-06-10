<template>
  <div>
    <q-dialog :model-value="modalProduto" persistent>
      <q-card style="min-width: 500px">
        <q-card-section class="bg-primary q-mb-md">
          <div class="text-h6 text-white">Cadastrar Produto</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <div class="row items-center q-col-gutter-md">
            <div class="col-8">
              <q-input label="Nome*" dense v-model="produto.name" :error="v$.produto.name.$error"/>
            </div>
            <div class="col-4">
              <q-input label="Preço*" dense v-model="produto.price" type="number" :error="v$.produto.price.$error"/>
            </div>
            <div class="col-12">
              <q-input
              label="Descrição"
                v-model="produto.description"
                dense
                maxlength="255"
                type="textarea"
              />
            </div>
            <div class="col-9">
              <q-input label="Número de serie" dense v-model="produto.serialNumber" disable type="number"/>
            </div>
            <div class="col-3">
              <q-btn icon="mdi-barcode-scan" class="q-mr-md" dense @click="readBarcode">
                <q-tooltip>
                  <span>Ler código de barras (Habilite a camera)</span>
                </q-tooltip>
              </q-btn>
              <q-btn icon="mdi-barcode" dense @click="generateSerialNumber">
                <q-tooltip>
                  <span>Gerar codigo de barras aleatorio</span>
                </q-tooltip>
              </q-btn>
            </div>
          </div>
        </q-card-section>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancelar" @click="closeModal"/>
          <q-btn label="Salvar" color="primary" @click="saveProduct" />
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="scanner" full-height persistent transition-show="scale" transition-hide="scale">
      <q-card>
        <q-card-section class="bg-primary text-white">
          Scanner
        </q-card-section>
        <q-card-section class="row justify-center items-center">
          <q-btn label="Abrir scanner" color="primary" @click="openScanner" v-if="!scannerShow"/>
          <div id="interactive" style="width: 100%;">
            <div class="camera-overlay" v-if="scannerShow"></div>
          </div>
        </q-card-section>
      </q-card>
      </q-dialog>
    </div>
</template>

<script>
import { required } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core';
import { notificarErro, notificarSucesso } from '../../helper/notification';
import { CreateProduct, UpdateProduct } from 'src/services/ProductService';
import Quagga from 'quagga'

export default {
  props: {
    modalProduto: {
      type: Boolean,
      default: false
    },
    produtoSelecionado: {
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
      produto: {
        name: undefined,
        price: undefined,
        serialNumber: undefined,
        description: undefined
      },
      scanner: false,
      scannerShow: false
    }
  },
  validations() {
    return {
      produto: {
        name: {
          required
        },
        price: {
          required
        }
      }
    }
  },
  methods: {
    async saveProduct () {
      this.v$.$touch()
      if (this.v$.$error) {
        notificarErro('Campos inválidos')
        return
      }
      this.produto.serialNumber.toString()
      if (this.isUpdate) {
        await UpdateProduct(this.produto, this.produtoSelecionado.id)
        notificarSucesso('O produto foi editado!')
      } else {
        await CreateProduct(this.produto)
        notificarSucesso('O produto foi criado!')
      }
      this.resetModel()
      this.$emit('reload-list')
      this.$emit('modal-state')
    },
    generateSerialNumber () {
      let randomNumber = '';
      for (let i = 0; i < 13; i++) {
        randomNumber += Math.floor(Math.random() * 10);
      }
      this.produto.serialNumber = randomNumber
    },
    readBarcode() {
      this.scanner = true
    },
    openScanner () {
      this.scannerShow = true
      const allReaders = [
        'code_128_reader',
        'ean_reader',
        'upc_reader',
        'code_39_reader',
        'code_93_reader',
        'codabar_reader',
        'i2of5_reader',
        '2of5_reader'
      ];
      Quagga.init({
        inputStream: {
          name: 'Live',
          type: 'LiveStream',
          target: '#interactive',
          constraints: {
            width: { max: 400 }
          }
        },
        decoder: {
          readers: allReaders,
          config: {
            supplements: [
              'ean_5_reader', 'ean_2_reader'
            ]
          }
        }
      }, (err) => {
        if (err) {
          console.error(err);
          return;
        }
        Quagga.start();
      });
      Quagga.onDetected((result) => {
        this.produto.serialNumber = result.codeResult.code;
        this.scanner = false
        this.scannerShow = false
        Quagga.stop();
      });
    },
    closeModal () {
      this.resetModel()
      this.$emit('modal-state')
    },
    resetModel () {
      this.produto = {
        name: undefined,
        price: undefined,
        serialNumber: undefined,
        description: undefined
      }
      this.v$.$reset()
    }
  },
  watch: {
    produtoSelecionado (val) {
      if (this.produtoSelecionado != {}) {
        this.produto = { ...this.produtoSelecionado }
      } else {
        this.resetModel()
      }
    }
  }
}
</script>

<style>
.camera-overlay {
  margin-top: -100px;
  position: absolute;
  top: 30%;   /* Porcentagem da altura total da área visível da câmera */
  right: 10%; /* Porcentagem da largura total da área visível da câmera */
  bottom: 40%;  /* Porcentagem da largura total da área visível da câmera */
  left: 10%; /* Porcentagem da altura total da área visível da câmera */
  border: 2px solid red; /* Estilo da borda */
}
</style>
