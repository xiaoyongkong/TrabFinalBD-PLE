<template>
  <div class="d-flex flex-column">
    <h2>
      Grupos de Questões
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
                Comentário
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in groups"
              :key="'group_' + item.name"
            >
              <td>{{ item.questionGroupID }}</td>
              <td>{{ item.description }}</td>
              <td>{{ item.comment }}</td>
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
      groups: null,
      loading: true
    }
  },

  created() {
    this.$axios.$get('/api/forms/groups/all').then(r => {
      this.groups = r
      console.log(r)
      this.loading = false
    })
  }
}
</script>
