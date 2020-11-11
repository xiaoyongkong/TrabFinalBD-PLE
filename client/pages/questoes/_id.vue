<template>
  <div class="d-flex flex-column">
    <h2>
      Questões
    </h2>
    <h4>
      Formulário: {{questionnaire}}<br/>
      Módulo: {{form}}
    </h4>

    <h4 class="mt-5">
      Módulos
    </h4>

    <div v-if="!loading">
      <v-simple-table v-if="questions">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left">
                ID
              </th>
              <th class="text-left">
                Módulo
              </th>
              <th class="text-left">
                Grupo
              </th>
              <th class="text-left">
                Questão
              </th>
              <th class="text-left">
                Tipo de Questão
              </th>
              <th class="text-left">
                Ação
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(item, j) in questions"
              :key="'question_' + j"
            >
              <td>{{ item.questionID }}</td>
              <td>{{ item.form }}</td>
              <td>{{ item.questionGroup ? item.questionGroup : 'Sem Grupo' }}</td>
              <td>{{ item.question }}</td>
              <td>{{ item.questionType }}</td>
              <td style="white-space: nowrap; width:0.1%;">
                <v-btn class="secondary" @click="{editFormId=item.crfFormsID; editDialog = true}"><v-icon>mdi-file-edit</v-icon></v-btn>
                <v-btn class="error" @click="deleteForm(item.crfFormsID)"><v-icon>mdi-delete</v-icon></v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <div class="d-flex mt-5">
        <v-btn class="primary" @click="setPage(page-1)"> <v-icon>mdi-arrow-left-bold</v-icon> </v-btn>
        <v-spacer />
        {{page}}
        <v-spacer/>
        <v-btn class="primary" @click="setPage(page+1)"> <v-icon>mdi-arrow-right-bold</v-icon> </v-btn>
      </div>

      <div class="d-flex mt-5">

        <div class="d-flex mt-5">
        <v-dialog
          v-model="editDialog"
          persistent
          max-width="600"
        >
          <v-card>
            <v-card-title class="headline">
              Editar questão
            </v-card-title>
            <v-card-text>
              <v-select
                :loading="editDialogLoading"
                label="Grupo"
                :items="selectableGroups"
                item-text="description"
                item-value="questionGroupID"
                v-model="editQuestion.questionGroupID"
                outlined
              />
              <v-text-field
                :loading="editDialogLoading"
                label="Nova Descrição"
                v-model="editQuestion.description"
                outlined
              />
              <v-select
                :loading="editDialogLoading"
                label="Tipo de Questão"
                :items="selectableQuestionTypes"
                item-text="description"
                item-value="questionTypeID"
                v-model="editQuestion.questionTypeID"
                outlined
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                :disabled="editDialogLoading"
                @click="updateQuestion()"
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
              Adicionar nova questão
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="headline">
              Adicionar nova questão
            </v-card-title>
            <v-card-text>
              <v-select
                :loading="editDialogLoading"
                label="Grupo"
                :items="selectableGroups"
                item-text="description"
                item-value="questionGroupID"
                v-model="editQuestion.questionGroupID"
                outlined
              />
              <v-text-field
                :loading="editDialogLoading"
                label="Nova Descrição"
                v-model="editQuestion.description"
                outlined
              />
              <v-select
                :loading="editDialogLoading"
                label="Tipo de Questão"
                :items="selectableQuestionTypes"
                item-text="description"
                item-value="questionTypeID"
                v-model="editQuestion.questionTypeID"
                outlined
              />
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="green darken-1"
                text
                :disabled="dialogLoading"
                @click="createQuestion()"
              >
                Criar nova questão
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
      questions: null,
      form: 'Módulo indefinido',
      questionnaire: 'Formulário indefinido',
      dialog: false,
      dialogLoading: false,
      editDialog: false,
      editDialogLoading: false,
      editQuestion: {
        description: null,
        questionTypeID: null,
        questionGroupID: null
      },
      editQuestionLoading: false,
      page: 1,
      selectableQuestionTypes: [{questionTypeID: null, description: 'Sem Tipo'}],
      selectableGroups: [{questionGroupID: null, description: 'Sem Grupo'}],
      loading: true
    }
  },

  created() {
    this.fetchQuestions()
    this.$axios.$get('/api/questions/types').then(r => {
      this.selectableQuestionTypes = this.selectableQuestionTypes.concat(r)
    })
    this.$axios.$get('/api/questions/groups').then(r => {
      this.selectableGroups = this.selectableGroups.concat(r)
    })
  },

  methods: {
    fetchQuestions() {
      this.$axios.$get('/api/questions/' + this.$route.params.id + '?page=' + this.page).then(r => {
        console.log(r)
        this.questions = r.data
        this.questionnaire = r.questionnaire
        this.form = r.form
        this.loading = false
      })
    },
    
    setPage(newPage) {
      if (newPage != 0) {
        this.loading = true
        this.page = newPage
        this.fetchQuestions()
      }
    },

    updateQuestion() {
      this.editDialog = false
    },

    createQuestion() {
      this.dialog = false
    }
  }
}
</script>
