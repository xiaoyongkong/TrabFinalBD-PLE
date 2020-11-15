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
              <th class="text-left">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in groups"
              :key="'group_' + item.description"
            >
              <td>{{ item.questionGroupID }}</td>
              <td>{{ item.description }}</td>
              <td>{{ item.comment }}</td>
              <td style="white-space: nowrap; width:0.1%;">
                <v-btn
                  color="secondary"
                  dark
                  @click="{editGroupId=item.questionGroupID; editDialog = true}"
                >
                  <v-icon>mdi-file-edit</v-icon>
                </v-btn>
                <v-btn class="error" @click="deleteGroup(item.questionGroupID)"><v-icon>mdi-delete</v-icon></v-btn>
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
            v-model="editGroupDescription"
            outlined
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            :disabled="editDialogLoading"
            @click="editGroup(editGroupId)"
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
            Adicionar novo Grupo de Questões
          </v-btn>
        </template>
        <v-card>
          <v-card-title class="headline">
            Adicionar novo Grupo de Questões
          </v-card-title>
          <v-card-text>
            <v-text-field
              :loading="dialogLoading"
              label="Descrição"
              v-model="newGroupDescription"
              outlined
            />
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="green darken-1"
              text
              :disabled="dialogLoading"
              @click="createGroup()"
            >
              Criar novo Grupo de Questões
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
      groups: null,
      loading: true,
      dialog: false,
      dialogLoading: false,
      editDialog: false,
      editGroupId: null,
      editDialogLoading: false,
      editGroupDescription: '',
      newGroupDescription: '',
      loading: true
    }
  },

  created() {
    this.fetchGroups()
  },

  methods: {
    fetchGroups() {
      this.$axios.$get('/api/forms/groups/all').then(r => {
        this.groups = r
        console.log(r)
        this.loading = false
      })
    },
    createGroup() {
      if (this.newGroupDescription.length > 0) {
        this.dialogLoading = true
        this.$axios.$post('/api/questions/groups/', {description: this.newGroupDescription}).then(r => {
          this.dialogLoading = false
          this.dialog = false
          this.fetchGroups()
        })
      }
    },

    deleteGroup(id) {
      this.$axios.$post('/api/questions/groups/delete', {id: id}).then(r => {
        this.fetchGroups()
      })
    },

    editGroup(id) {
      this.editDialogLoading = true
      this.$axios.$post('/api/questions/groups/edit', {id: id, description: this.editGroupDescription}).then(r => {
        this.editDialogLoading = false
        this.editDialog = false
        this.fetchGroups()
      })
    },
  }
}
</script>
