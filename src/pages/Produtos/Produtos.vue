<template>
  <div class="q-px-xl">
    <div class="row justify-between items-center">
      <h4 class="text-bold">Produtos e serviços</h4>
      <q-btn label="Adicionar" icon="mdi-plus" color="primary" @click="modalState"/>
    </div>

    <div>
      <q-table
      :columns="colunasProduto"
      :rows="products"
      row-key="id"
      >
      <template v-slot:body-cell-acoes="props">
        <td align="center">
          <q-btn icon="mdi-pencil" flat @click="editProduct(props.row)"/>
          <q-btn icon="mdi-delete" flat @click="deleteProduct(props.row)"/>
        </td>
      </template>
      </q-table>
    </div>
    <ModalCadastroProdutoVue :modalProduto="modalProduto" @modal-state="modalState" @reload-list="listProducts" :produtoSelecionado="produtoSelecionado" :isUpdate="isUpdate"/>
  </div>
</template>

<script>
import { DeleteProduct, ListProducts } from 'src/services/ProductService';
import ModalCadastroProdutoVue from './ModalCadastroProduto.vue';
import { notificarSucesso } from '../../helper/notification';

export default {
  components: {
    ModalCadastroProdutoVue
  },
  data () {
    return {
      products: [],
      modalProduto: false,
      produtoSelecionado: {},
      isUpdate: false
    }
  },
  methods: {
    async listProducts () {
      const { data } = await ListProducts()
      this.products = data.products
    },
    modalState () {
      this.produtoSelecionado = {}
      this.isUpdate = false
      this.modalProduto = !this.modalProduto
    },
    editProduct (produto) {
      this.produtoSelecionado = produto
      this.isUpdate = true
      this.modalProduto = true
    },
    deleteProduct (produto) {
      this.$q.dialog({
        title: 'Cuidado!',
        message: `Essa ação ira deletar ${produto.name}. Deseja continuar?`,
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
        await DeleteProduct(produto.id)
        this.listProducts()
        notificarSucesso('Produto deletado!')
      })
    }
  },
  computed: {
    colunasProduto() {
      return [
        { name: 'nome', label: 'Nome', field: 'name', style: 'width: 250px', align: 'left' },
        { name: 'preco', label: 'Preço', field: 'price', style: 'width: 200px', align: 'left' },
        { name: 'descricao', label: 'Descrição', field: 'description', align: 'left' },
        { name: 'serialNumber', label: 'Numero de serie', field: 'serialNumber', align: 'left' },
        { name: 'acoes', label: 'Ações', field: '', align: 'center' }
      ]
    }
  },
  mounted () {
    this.listProducts()
  }
}
</script>

<style>

</style>
