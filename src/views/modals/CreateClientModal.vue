<template>
  <b-modal
    size="xl"
    v-model="createEditModal"
    @hidden="closeModal"
    title="Add Client"
    @ok.prevent="addClient"
  >
    <b-form-row class="mb-2">
      <b-col>
        <b-form-group label="First Name:" label-for="input-1">
          <b-form-input
            class="mb-2 mr-sm-2 mb-sm-0"
            placeholder="First Name"
            v-model="client.first_name"
          />
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group label="Last Name:" label-for="input-1">
          <b-form-input
            class="mb-2 mr-sm-2 mb-sm-0"
            placeholder="Last Name"
            v-model="client.last_name"
          />
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group label="Date of Birth:" label-for="input-1">
          <b-form-datepicker
            v-model="client.dob"
            :min="min"
            :max="max"
            locale="en"
          />
        </b-form-group>
      </b-col>
    </b-form-row>
    <b-form-row>
      <b-col>
        <b-form-group label="Phone:" label-for="input-1">
          <b-form-input
            class="mb-2 mr-sm-2 mb-sm-0"
            placeholder="Phone"
            v-model="client.phone"
          />
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group label="Email address:" label-for="input-1">
          <b-form-input
            v-model="client.email"
            type="email"
            placeholder="Enter email"
            required
          />
        </b-form-group>
      </b-col>
      <b-col>
        <b-form-group label="Address:" label-for="input-1">
          <b-form-input
            class="mb-2 mr-sm-2 mb-sm-0"
            placeholder="Address"
            v-model="client.address"
          />
        </b-form-group>
      </b-col>
    </b-form-row>
    <b-row>
      <b-col>
        <h2>
          <b-badge>Payments</b-badge>
        </h2></b-col
      >
      <b-col>
        <b-button type="button" v-on:click="addPayment" class="btn btn-primary">
          <i class="fa-solid fa-plus" />
        </b-button>
      </b-col>
    </b-row>

    <div v-for="payment in client.payments" :key="payment.id">
      <b-form-row class="mb-2">
        <b-col>
          <b-form-group label="Transaction ID:" label-for="input-1">
            <b-form-input
              class="mb-2 mr-sm-2 mb-sm-0"
              placeholder="Transaction ID"
              v-model="payment.transaction"
            />
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group label="Amount:" label-for="input-1">
            <b-form-input
              class="mb-2 mr-sm-2 mb-sm-0"
              placeholder="Amount"
              v-model="payment.amount"
            />
          </b-form-group>
        </b-col>
        <b-col>
          <b-form-group label="Date:" label-for="input-1">
            <b-form-datepicker
              v-model="payment.date"
              :min="min"
              :max="max"
              locale="en"
            />
          </b-form-group>
        </b-col>
      </b-form-row>
    </div>
    <!--    <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ client }}</pre>
    </b-card>-->
  </b-modal>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import ClientsApiServices from "@/components/services/clients-api-services";

export default {
  name: "CreateClientModal",
  data() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // 15th two months prior
    const minDate = new Date(today);
    minDate.setMonth(minDate.getMonth());
    minDate.setDate(now.now);
    // 15th in two months
    const maxDate = new Date(today);
    maxDate.setMonth(maxDate.getMonth());
    maxDate.setDate(now.now);
    return {
      value: "",
      min: minDate,
      max: maxDate,
      createEditModal: false,
      show: true,
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
    ...mapGetters({
      CLIENT_INFORMATION: "CLIENT_INFORMATION",
    }),
  },
  async created() {
    this.createEditModal = true;
  },
  methods: {
    ...mapMutations({
      SAVE_CLIENT: "SAVE_CLIENT",
    }),
    addPayment() {
      if (this.client.payments.length < 5)
        this.client.payments.push({
          id: null,
        });
    },
    addClient: async function () {
      try {
        const response = await ClientsApiServices.createClient(this.client);
        this.SAVE_CLIENT(response.data[0]);
        console.log(response.data[0]);
      } catch (error) {
        console.log(error);
      }
      this.createEditModal = false;
    },
    closeModal() {
      this.createEditModal = false;
      this.$emit("closeModal");
    },
  },
};
</script>

<style scoped></style>
