<template>
  <div>
    <b-button class="btn btn-success" @click="openCreateEdit">
      <i class="fa-solid fa-plus"></i>
    </b-button>

    <b-table striped hover :items="clients" :fields="fields">
      <template #cell(actions)="data">
        <b-button @click="openCreateEdit(data.item)" class="mx-2"
          ><i class="fas fa-edit"
        /></b-button>
        <b-button><i class="fas fa-trash" /></b-button>
      </template>
    </b-table>

    <create-edit-modal v-if="createEditModal" @closeModal="closeModal" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import CreateEditModal from "@/views/modals/CreateEditModal";

export default {
  name: "ClientsView",
  components: { CreateEditModal },
  props: {
    // clients: [],
  },
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
          label: "Payments",
          sortable: true,
        },

        {
          key: "total_payments",
          label: "Total",
          sortable: true,
        },
        {
          key: "actions",
          label: "Actions",
        },
      ],
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
  computed: mapState(["clients"]),
  created() {
    this.$store.dispatch("loadClients");
  },
  methods: {
    openCreateEdit(item) {
      this.clientData = item;
      this.createEditModal = true;
    },
    closeModal() {
      this.createEditModal = false;
    },
  },
};
</script>

<style scoped></style>
