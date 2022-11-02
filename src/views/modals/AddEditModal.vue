<template>
  <ValidationObserver ref="clientModal">
    <b-modal
      centered
      size="xl"
      v-model="show"
      @hidden="closeModal"
      :title="
        CLIENT_INFORMATION ? 'Edit Client ' + CLIENT_INFORMATION : 'Add Client'
      "
    >
      <!--      :title="`${message}`"-->
      <b-card>
        <b-card-title>Personal Information</b-card-title>
        <b-list-group flush>
          <b-container class="bv-example-row bv-example-row-flex-cols">
            <b-list-group-item>
              <b-row align-v="stretch" class="mb-2">
                <b-col align-self="center">
                  <b-form-group label="First Name:">
                    <ValidationProvider
                      name="first name"
                      rules="required|alpha|min:3"
                      v-slot="{ errors }"
                    >
                      <b-form-input
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="First Name"
                        v-model="client.first_name"
                      />
                      <span class="messageError">{{ errors[0] }}</span>
                    </ValidationProvider>
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Last Name:">
                    <ValidationProvider
                      name="last name"
                      rules="required|alpha|min:3"
                      v-slot="{ errors }"
                    >
                      <b-form-input
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="Last Name"
                        v-model="client.last_name"
                      />
                      <span class="messageError">{{ errors[0] }}</span>
                    </ValidationProvider>
                  </b-form-group>
                </b-col>
                <b-col>
                  <ValidationProvider
                    rules="required"
                    name="Date of Birth"
                    v-slot="{ errors }"
                  >
                    <b-form-group label="Date of Birth:">
                      <b-form-datepicker
                        v-model="client.dob"
                        :min="minDOB"
                        :max="maxDOB"
                        locale="en"
                      />
                      <span class="messageError">{{ errors[0] }}</span>
                    </b-form-group>
                  </ValidationProvider>
                </b-col>
              </b-row>
              <b-row align-v="stretch" class="mb-1">
                <b-col>
                  <b-form-group label="Phone:">
                    <ValidationProvider
                      name="phone"
                      rules="required"
                      v-slot="{ errors }"
                    >
                      <b-form-input
                        v-mask="'(###) ####-###'"
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="Phone"
                        v-model="client.phone"
                      />
                      <span class="messageError">{{ errors[0] }}</span>
                    </ValidationProvider>
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Email address:">
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
                      <span class="messageError">{{ errors[0] }}</span>
                    </ValidationProvider>
                  </b-form-group>
                </b-col>
                <b-col>
                  <b-form-group label="Address:">
                    <validation-provider
                      rules="required"
                      name="address"
                      v-slot="{ errors }"
                    >
                      <b-form-input
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="Address"
                        v-model="client.address"
                      />
                      <span class="messageError">{{ errors[0] }}</span>
                    </validation-provider>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-list-group-item>
            <b-list-group-item>
              <b-row>
                <b-col align-self="center" cols="auto" class="mr-auto">
                  <h4>Payments</h4>
                </b-col>
                <b-col cols="auto">
                  <b-button
                    type="button"
                    v-on:click="addPayment"
                    variant="primary"
                  >
                    <i class="fa-solid fa-plus" /></b-button
                ></b-col>
              </b-row>
              <b-row
                align-v="center"
                v-for="(payment, i) in client.payments"
                :key="payment.id"
              >
                <b-col class="my-2">
                  <b-form-group label="Transaction ID:">
                    <ValidationProvider
                      name="transaction Id"
                      rules="required|digits:3"
                      v-slot="{ errors }"
                    >
                      <b-form-input
                        class="mb-2 mr-sm-2 mb-sm-0"
                        placeholder="Transaction ID"
                        v-model="payment.transaction"
                      />
                      <span class="messageError">{{ errors[0] }}</span>
                    </ValidationProvider>
                  </b-form-group>
                </b-col>
                <b-col class="my-2">
                  <b-form-group label="Amount:">
                    <ValidationProvider
                      name="amount"
                      rules="required|positive"
                      v-slot="{ errors }"
                    >
                      <money
                        class="form-control"
                        v-model="payment.amount"
                        v-bind="money"
                      />
                      <span class="messageError">{{ errors[0] }}</span>
                    </ValidationProvider>
                  </b-form-group>
                </b-col>
                <b-col align-self="center">
                  <b-form-group label="Date:">
                    <ValidationProvider
                      rules="required"
                      name="Date"
                      v-slot="{ errors }"
                    >
                      <b-form-datepicker
                        v-model="payment.date"
                        :min="minDateP"
                        :max="maxDateP"
                        locale="en"
                      />
                      <span class="messageError">{{ errors[0] }}</span>
                    </ValidationProvider>
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
          </b-container>
        </b-list-group>
      </b-card>
      <template #modal-footer>
        <b-button variant="primary" @click.prevent="handleSubmit"
          >Save</b-button
        >
      </template>
    </b-modal>
  </ValidationObserver>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import ClientsApiServices from "@/components/services/clients-api-services";
import { Money } from "v-money";

import { extend } from "vee-validate";
import * as rules from "vee-validate/dist/rules";
import { messages } from "vee-validate/dist/locale/en.json";

extend("positive", (value) => {
  if (value >= 0) {
    return true;
  }
  return "This field must be a positive number";
});

Object.keys(rules).forEach((rule) => {
  extend(rule, {
    ...rules[rule], // copies rule configuration
    message: messages[rule], // assign message
  });
});

export default {
  components: { Money },

  name: "AddEditModal",
  data() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    // 15th two months prior
    const minDateDOB = new Date(today);
    minDateDOB.setMonth(minDateDOB.getMonth() - 1560);
    minDateDOB.setDate(1);

    const minDatePay = new Date(today);
    minDatePay.setMonth(minDatePay.getMonth() - 60);
    minDatePay.setDate(1);

    // 15th in two months
    const maxDateDOB = new Date(today);
    maxDateDOB.setMonth(maxDateDOB.getMonth() - 216);
    maxDateDOB.setDate(today.getDay() - 1);

    const maxDatePay = new Date(today);
    maxDatePay.setMonth(maxDatePay.getMonth());
    maxDatePay.setDate(today.getDay() - 1);

    return {
      show: false,
      minDOB: minDateDOB,
      maxDOB: maxDateDOB,
      minDateP: minDatePay,
      maxDateP: maxDatePay,
      client: {
        first_name: "",
        last_name: "",
        dob: "",
        phone: "",
        email: "",
        address: "",
        payments: [{}],
      },

      money: {
        decimal: ",",
        thousands: ".",
        prefix: "$ ",
        precision: 2,
        // masked: false /* doesn't work with directive */,
      },
      id: "",
    };
  },
  created() {
    this.show = true;
    if (this.CLIENT_INFORMATION) {
      this.getClientData();
    }
  },
  computed: {
    ...mapGetters({
      CLIENT_INFORMATION: "CLIENT_INFORMATION",
    }),
  },
  methods: {
    ...mapMutations({
      SAVE_CLIENT: "SAVE_CLIENT",
      UPDATE_CLIENT: "UPDATE_CLIENT",
      DELETE_CLIENT: "DELETE_CLIENT",
      SET_CLIENT_ID: "SET_CLIENT_ID",
    }),
    async handleSubmit() {
      const validate = await this.$refs.clientModal.validate();
      if (validate) {
        if (this.CLIENT_INFORMATION) {
          await this.updateClient();
        } else {
          await this.addClient();
        }
      }
    },
    addPayment() {
      if (this.client.payments.length < 5)
        this.client.payments.push({ id: null });
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
    addClient: async function () {
      try {
        const response = await ClientsApiServices.createClient(this.client);
        this.SAVE_CLIENT(response.data[0]);
        // console.log(response.data[0]);
      } catch (error) {
        console.log(error);
      }
      this.show = false;
    },
    updateClient: async function () {
      try {
        await ClientsApiServices.UpdateClientWithPayments(this.client);
        await this.UPDATE_CLIENT(this.client);
      } catch (error) {
        console.log(error);
      }
      this.show = false;
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
      this.show = false;
      this.SET_CLIENT_ID();
      this.$emit("closeModal");
    },
  },
};
</script>

<style scoped>
.messageError {
  color: #dc3545;
}
</style>
