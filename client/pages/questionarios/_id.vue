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
              class="row_link"
              @click="$router.push('/questoes/' + item.crfFormsID)"
            >
              <td>{{ item.crfFormsID }}</td>
              <td>{{ item.description }}</td>
              <td><v-btn class="secondary">Editar</v-btn></td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
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
      loading: true
    }
  },

  created() {
    this.$axios.$get('/api/questionnaires/' + this.$route.params.id).then(r => {
      console.log(r[0])
      this.questionnaire = r[0]
      this.loading = false
      this.$axios.$get('/api/forms/crfforms/' + this.$route.params.id).then(r => {
        console.log(r)
        this.forms = r
      })
    })
  }
}
</script>
