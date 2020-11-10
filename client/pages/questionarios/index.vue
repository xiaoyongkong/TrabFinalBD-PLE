<template>
  <div class="d-flex flex-column">
    <h2>
      Questionários
    </h2>

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
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in questionnaires"
              :key="'questionnaire_' + item.questionnaireID"
            >
              <td>{{ item.questionnaireID }}</td>
              <td
              @click="$router.push(`/questionarios/${item.questionnaireID}`)"
              class="row_link"
              >
                {{ item.description }}
              </td>
              <td style="white-space: nowrap; width:0.1%;">
                <v-btn
                  color="secondary"
                  dark
                  @click="{editQuestionnaireId=item.questionnaireID; editDialog = true}"
                >
                  <v-icon>mdi-file-edit</v-icon>
                </v-btn>
                <v-btn class="error" @click="deleteQuestionnaire(item.questionnaireID)"><v-icon>mdi-delete</v-icon></v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>

    <div v-else>
      <v-progress-circular indeterminate />
    </div>

    <v-dialog
      v-model="editDialog"
      persistent
      max-width="600"
    >
      <v-card>
        <v-card-title class="headline">
          Editar questionário
        </v-card-title>
        <v-card-text>
          <v-text-field
            :loading="editDialogLoading"
            label="Nova Descrição"
            v-model="editQuestionnaireDescription"
            outlined
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            :disabled="editDialogLoading"
            @click="editQuestionnaire(editQuestionnaireId)"
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

    <div class="d-flex mt-5"> 
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
            Adicionar novo questionário
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">
            Adicionar novo questionário
          </v-card-title>
          <v-card-text>
            <v-text-field
              :loading="dialogLoading"
              label="Descrição"
              v-model="newQuestionnaireDescription"
              outlined
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              :disabled="dialogLoading"
              @click="createQuestionnaire()"
            >
              Criar novo questionário
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
</template>

<script>

export default {
  components: {
  },

  data: () => {
    return {
      questionnaires: null,
      dialog: false,
      dialogLoading: false,
      editDialog: false,
      editQuestionnaireId: null,
      editDialogLoading: false,
      editQuestionnaireDescription: '',
      newQuestionnaireDescription: '',
      loading: true
    }
  },

  created() {
    this.fetchQuestionnaires()
  },

  methods: {
    createQuestionnaire() {
      if (this.newQuestionnaireDescription.length > 0) {
        this.dialogLoading = true
        this.$axios.$post('/api/questionnaires/', {description: this.newQuestionnaireDescription}).then(r => {
          this.dialogLoading = false
          this.dialog = false
          this.fetchQuestionnaires()
        })
      }
    },

    deleteQuestionnaire(id) {
      this.$axios.$post('/api/questionnaires/delete', {id: id}).then(r => {
        this.fetchQuestionnaires()
      })
    },

    editQuestionnaire(id) {
      this.editDialogLoading = true
      this.$axios.$post('/api/questionnaires/edit', {id: id, description: this.editQuestionnaireDescription}).then(r => {
        this.editDialogLoading = false
        this.editDialog = false
        this.fetchQuestionnaires()
      })
    },

    fetchQuestionnaires() {
      this.loading = true
      this.$axios.$get('/api/questionnaires/').then(r => {
        this.questionnaires = r
        this.loading = false
      })
    }
  }
}
</script>

