<template>
  <b-modal
    centered
    size="xl"
    v-model="showEditModal"
    @hidden="closeModal"
    hide-footer
    hide-header-close
  >
    <b-card>
      <template #header>
        <h4 class="mb-0">Edit Client {{ CLIENT_INFORMATION }}</h4>
      </template>
      <b-card-title>Personal Information</b-card-title>
      <b-list-group flush>
        <b-list-group-item>
          <b-form-row class="mb-2">
            <b-col>
              <b-form-group label="First Name:" label-for="input-1">
                <validation-provider rules="positive" v-slot="{ errors }">
                  <b-form-input
                    class="mb-2 mr-sm-2 mb-sm-0"
                    placeholder="First Name"
                    v-model="client.first_name"
                  />
                  <span>{{ errors[0] }}</span>
                </validation-provider>
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
                <ValidationProvider rules="digits:9" v-slot="{ errors }">
                  <b-form-input
                    class="mb-2 mr-sm-2 mb-sm-0"
                    placeholder="Phone"
                    v-model="client.phone"
                  />
                  <span>{{ errors[0] }}</span>
                </ValidationProvider>
              </b-form-group>
            </b-col>
            <b-col>
              <b-form-group label="Email address:" label-for="input-1">
                <ValidationProvider
                  name="email"
                  rules="required|email"
                  v-slot="{ errors }"
                >
                  <b-form-input
                    v-model="client.email"
                    type="email"
                    placeholder="Enter email"
                    required
                  />
                  <span>{{ errors[0] }}</span>
                </ValidationProvider>
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
        </b-list-group-item>
        <b-list-group-item>
          <b-row>
            <b-col align-self="center" cols="auto" class="mr-auto">
              <h4>Payments</h4>
            </b-col>
            <b-col cols="auto">
              <b-button type="button" v-on:click="addPayment" variant="primary">
                <i class="fa-solid fa-plus" /></b-button
            ></b-col>
          </b-row>
          <b-row
            align-v="center"
            v-for="(payment, i) in client.payments"
            :key="payment.id"
          >
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
            <b-col cols="auto">
              <b-form-group label="Date:" label-for="input-1">
                <b-form-datepicker
                  v-model="payment.date"
                  :min="min"
                  :max="max"
                  locale="en"
                />
              </b-form-group>
            </b-col>
            <b-col cols="auto">
              <b-button
                class="btn btn-danger"
                @click="deletePayment(payment.id, i)"
                ><i class="fas fa-trash" /></b-button
            ></b-col>
          </b-row>
        </b-list-group-item>
      </b-list-group>
      <b-button block variant="primary" @click.prevent="updateClient"
        >Save</b-button
      >
    </b-card>
  </b-modal>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import ClientsApiServices from "@/components/services/clients-api-services";
import { extend } from "vee-validate";
import { required, email } from "vee-validate/dist/rules";

// No message specified.
extend("email", email);

// Override the default message.
extend("required", {
  ...required,
  message: "This field is required",
});
extend("positive", (value) => {
  return value >= 0;
});

export default {
  name: "EditClientModal",

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
      showEditModal: false,
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
  created() {
    this.showEditModal = true;
    this.getClientData();
  },
  methods: {
    ...mapMutations({
      UPDATE_CLIENT: "UPDATE_CLIENT",
    }),
    addPayment() {
      if (this.client.payments.length < 5)
        this.client.payments.push({ id: null });
      console.log(this.client.payments.length);
    },
    getClientData: async function () {
      // eslint-disable-next-line no-useless-catch
      try {
        let response = await ClientsApiServices.getClientById(
          this.CLIENT_INFORMATION
        );
        this.client = response.data[0];
      } catch (e) {
        throw e;
      }
    },
    updateClient: async function () {
      try {
        await ClientsApiServices.UpdateClientWithPayments(this.client);
        await this.UPDATE_CLIENT(this.client);
      } catch (error) {
        console.log(error);
      }
      this.showEditModal = false;
    },
    deletePayment: async function (id, i) {
      try {
        if (id === null) {
          this.client.payments.splice(i, 1);
        } else {
          await ClientsApiServices.deletePayment(id);
          this.client.payments = this.client.payments.filter(
            (pay) => pay.id !== id
          );
        }
      } catch (error) {
        console.log(error);
      }
    },
    closeModal() {
      this.showEditModal = false;
      this.$emit("closeModal");
    },
  },
};
</script>

<style scoped></style>
