<template>
  <div class="d-flex flex-column">
    <h2>
      Questionário
    </h2>
    <h3 v-if="!loading">
      {{questionnaire.description}}
    </h3>

    <h4 class="mt-5">
      Módulos
    </h4>

    <div v-if="!loading">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                ID
              </th>
              <th class="text-left">
                Descrição
              </th>
              <th class="text-left">
                Ação
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in forms"
              :key="'forms_' + item.crfFormsID"
            >
              <td>{{ item.crfFormsID }}</td>
              <td
                class="row_link"
                @click="$router.push('/questoes/' + item.crfFormsID)"
              >
                {{ item.description }}
              </td>
              <td style="white-space: nowrap; width:0.1%;">
                
                <v-btn class="secondary" @click="{editFormId=item.crfFormsID; editDialog = true}"><v-icon>mdi-file-edit</v-icon></v-btn>
                <v-btn class="error" @click="deleteForm(item.crfFormsID)"><v-icon>mdi-delete</v-icon></v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <div class="d-flex mt-5">
        <v-dialog
          v-model="editDialog"
          persistent
          max-width="600"
        >
          <v-card>
            <v-card-title class="headline">
              Editar módulo
            </v-card-title>
            <v-card-text>
              <v-text-field
                :loading="editDialogLoading"
                label="Nova Descrição"
                v-model="editFormDescription"
                outlined
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                :disabled="editDialogLoading"
                @click="editForm(editFormId)"
              >
                Confirmar
              </v-btn>
              <v-btn
                color="red darken-1"
                text
                :disabled="editDialogLoading"
                @click="editDialog = false"
              >
                Cancelar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog
          v-model="dialog"
          persistent
          max-width="600"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
            >
              Adicionar novo módulo
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="headline">
              Adicionar novo módulo
            </v-card-title>
            <v-card-text>
              <v-text-field
                :loading="dialogLoading"
                label="Descrição"
                v-model="newFormDescription"
                outlined
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                :disabled="dialogLoading"
                @click="createForm()"
              >
                Criar novo módulo
              </v-btn>
              <v-btn
                color="red darken-1"
                text
                :disabled="dialogLoading"
                @click="dialog = false"
              >
                Cancelar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </div>

    <div v-else>
      <v-progress-circular indeterminate />
    </div>

  </div>
</template>

<script>

export default {
  components: {
  },

  data: () => {
    return {
      questionnaire: null,
      forms: [],
      loading: true,
      dialog: false,
      dialogLoading: false,
      editDialog: false,
      editDialogLoading: false,
      editFormId: null,
      editFormDescription: '',
      newFormDescription: '',
      loading: true
    }
  },

  created() {
    this.$axios.$get('/api/questionnaires/' + this.$route.params.id).then(r => {
      console.log(r[0])
      this.questionnaire = r[0]
      this.fetchForms()
    })
  },

  methods: {
    createForm() {
      if (this.newFormDescription.length > 0) {
        this.dialogLoading = true
        this.$axios.$post('/api/forms/crfforms/', {description: this.newFormDescription, questionnaireID: this.questionnaire.questionnaireID}).then(r => {
          this.dialogLoading = false
          this.dialog = false
          this.fetchForms()
        })
      }
    },

    deleteForm(id) {
      this.$axios.$post('/api/forms/crfforms/delete', {id: id}).then(r => {
        this.fetchForms()
      })
    },

    editForm(id) {
      this.editDialogLoading = true
      console.log({id: id, description: this.editFormDescription})
      this.$axios.$post('/api/forms/crfforms/edit', {id: id, description: this.editFormDescription}).then(r => {
        this.editDialogLoading = false
        this.editDialog = false
        this.fetchForms()
      })
    },

    fetchForms() {
      this.loading = true
      this.$axios.$get('/api/forms/crfforms/' + this.$route.params.id).then(r => {
        this.forms = r
        console.log(r)
        this.loading = false
      })
    }

  }
}
</script>
