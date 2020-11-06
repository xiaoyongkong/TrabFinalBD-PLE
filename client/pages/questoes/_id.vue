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
              class="row_link"
            >
              <td>{{ item.questionID }}</td>
              <td>{{ item.form }}</td>
              <td>{{ item.question }}</td>
              <td>{{ item.questionType }}</td>
              <td><v-btn class="secondary">Editar</v-btn></td>
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
      page: 1,
      loading: true
    }
  },

  created() {
    this.fetchQuestions()
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
    }
  }
}
</script>
