<template>
  <div>
    <b-card class="p-3">
      <template #header>
        <b-row class="mx-2">
          <b-col align-self="center" cols="auto" class="mr-auto">
            <h3>Clients</h3>
          </b-col>
          <b-col align-self="center">
            <b-form-group
              label="Filter"
              label-for="filter-input"
              label-cols-sm="3"
              label-align-sm="right"
              label-size="sm"
              class="mb-0"
            >
              <b-input-group size="sm">
                <b-form-input
                  id="filter-input"
                  v-model="filter"
                  type="search"
                  placeholder="Type to Search"
                ></b-form-input>

                <b-input-group-append>
                  <b-button
                    class="ml-2"
                    variant="dark"
                    :disabled="!filter"
                    @click="filter = ''"
                    >Clear</b-button
                  >
                </b-input-group-append>
              </b-input-group>
            </b-form-group>
          </b-col>
          <b-col cols="auto"
            ><b-button
              class="btn btn-success my-2"
              @click="openAddEditModal(null)"
            >
              <i class="fa-solid fa-plus"></i>
              Add Clients
            </b-button></b-col
          >
        </b-row>
      </template>
      <b-card-body>
        <b-table
          head-variant="dark"
          striped
          hover
          :per-page="perPage"
          :current-page="currentPage"
          :items="clientData"
          :fields="fields"
          :filter="filter"
          :filter-included-fields="filterOn"
          stacked="md"
          show-empty
          small
          @filtered="onFiltered"
        >
          <template #cell(actions)="data">
            <b-button
              @click="openAddEditModal(data.item.id)"
              class="mx-2 btn btn-info"
              ><i class="fas fa-edit"
            /></b-button>
            <b-button class="btn btn-danger" @click="deleteClient(data.item.id)"
              ><i class="fas fa-trash"
            /></b-button>
          </template>
        </b-table>
        <b-row>
          <b-col sm="5" md="4" class="mr-auto">
            <b-form-group
              label="Per page"
              label-for="per-page-select"
              label-cols-sm="6"
              label-cols-md="4"
              label-cols-lg="3"
              label-align-sm="right"
              label-size="sm"
              class="mb-0"
            >
              <b-form-select
                id="per-page-select"
                v-model="perPage"
                :options="pageOptions"
                size="sm"
              ></b-form-select>
            </b-form-group>
          </b-col>
          <b-col cols="auto">
            <b-pagination
              align="right"
              v-model="currentPage"
              :total-rows="rows"
              :per-page="perPage"
            ></b-pagination>
          </b-col>
        </b-row>
      </b-card-body>
    </b-card>
    <add-edit-modal v-if="show" @closeModal="closeModal" />
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import ClientsApiServices from "@/components/services/clients-api-services";
import AddEditModal from "@/views/modals/AddEditModal";

export default {
  name: "ClientsView",
  components: { AddEditModal },
  data() {
    return {
      filter: null,
      filterOn: [],
      perPage: 5,
      currentPage: 1,
      fields: [
        {
          key: "full_name",
          sortable: true,
        },
        {
          key: "dob",
          label: "DOB",
          sortable: true,
        },
        {
          key: "phone",
          label: "Phone",
          sortable: true,
        },
        {
          key: "email",
          label: "Email",
          sortable: true,
        },

        {
          key: "address",
          label: "Address",
          sortable: true,
        },
        {
          key: "total_payments",
          label: "Payments",
          sortable: true,
        },
        {
          key: "total_amount",
          label: "Total Amount",
          sortable: true,
        },

        {
          key: "actions",
          label: "Actions",
        },
      ],
      createClientModal: false,
      createEditModal: false,
      show: false,
      pageOptions: [5, 10, 15, { value: 100, text: "Show a lot" }],

      client: {
        first_name: "",
        last_name: "",
        dob: "",
        phone: "",
        email: "",
        address: "",
        payments: [{}],
      },
    };
  },
  computed: {
    rows() {
      return this.clientData.length;
    },
    clientData() {
      return this.$store.getters.CLIENT_DATA;
    },
  },
  created() {
    this.$store.dispatch("loadClients");
  },
  methods: {
    ...mapActions({
      GET_CLIENT_BY_ID: "getClient",
    }),
    ...mapMutations({
      GET_CLIENTS: "GET_CLIENTS",
      DELETE_CLIENT: "DELETE_CLIENT",
    }),
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
    deleteClient: async function (id) {
      try {
        if (
          confirm("Are you sure you want to delete this client " + id + "?")
        ) {
          // console.log("res ", id);
          await ClientsApiServices.deleteClient(id);
          this.DELETE_CLIENT(id);
        }
      } catch (error) {
        console.log(error);
      }
    },
    openAddEditModal(id) {
      this.GET_CLIENT_BY_ID(id);
      this.show = true;
    },
    closeModal() {
      this.show = false;
    },
  },
};
</script>

<style scoped></style>
