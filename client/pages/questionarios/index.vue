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
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in questionnaires"
              class="row_link"
              :key="'questionnaire_' + item.questionnaireID"
              @click="$router.push(`/questionarios/${item.questionnaireID}`)"
            >
              <td>{{ item.questionnaireID }}</td>
              <td>{{ item.description }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>

    <div v-else>
      <v-progress-circular indeterminate />
    </div>

    <div class="d-flex mt-5">
      <v-btn class="primary">Adicionar novo questionário</v-btn>
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
      loading: true
    }
  },

  created() {
    this.$axios.$get('/api/questionnaires/').then(r => {
      console.log(r)
      this.questionnaires = r
      console.log(r)
      this.loading = false
    })
  }
}
</script>

