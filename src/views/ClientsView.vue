<template>
  <div>
    <b-row>
      <b-col>
        <h2>
          <b-badge>Clients</b-badge>
        </h2></b-col
      >
      <b-col>
        <b-button class="btn btn-success my-2" @click="openCreateClient">
          <i class="fa-solid fa-plus"></i>
          Add Clients
        </b-button>
      </b-col>
    </b-row>
    <b-table striped hover :items="clientData" :fields="fields">
      <template #cell(actions)="data">
        <b-button @click="openCreateEdit(data.item)" class="mx-2"
          ><i class="fas fa-edit"
        /></b-button>
        <b-button @click="deleteClient(data.item.id)"
          ><i class="fas fa-trash"
        /></b-button>
      </template>
    </b-table>
    <create-client-modal v-if="createClientModal" @closeModal="closeModal" />
    <create-edit-modal v-if="createEditModal" @closeModal="closeModal" />
  </div>
</template>

<script>
import { mapActions, mapMutations } from "vuex";
import CreateEditModal from "@/views/modals/CreateEditModal";
import CreateClientModal from "@/views/modals/CreateClientModal";
import ClientsApiServices from "@/components/services/clients-api-services";

export default {
  name: "ClientsView",
  components: { CreateEditModal, CreateClientModal },
  data() {
    return {
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
          key: "total_amount",
          label: "Total Amount",
          sortable: true,
        },

        {
          key: "total_payments",
          label: "Payments",
          sortable: true,
        },
        {
          key: "actions",
          label: "Actions",
        },
      ],
      createClientModal: false,
      createEditModal: false,
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

    deleteClient: async function (id) {
      try {
        if (
          confirm("Are you sure you want to delete this client " + id + "?")
        ) {
          console.log("res ", id);
          await ClientsApiServices.deleteClient(id);
          this.DELETE_CLIENT(id);
        }
      } catch (error) {
        console.log(error);
      }
    },

    openCreateEdit(item) {
      // console.log(item.id);
      this.GET_CLIENT_BY_ID(item.id);
      // this.$store.dispatch("updateClients", item.id);
      this.client = item;
      this.createEditModal = true;
    },
    openCreateClient() {
      this.createClientModal = true;
    },
    closeModal() {
      this.createEditModal = false;
      this.createClientModal = false;
    },
  },
};
</script>

<style scoped></style>
