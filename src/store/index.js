import Vue from "vue";
import Vuex from "vuex";
import ClientsApiServices from "@/components/services/clients-api-services";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    items: [
      { age: 40, first_name: "Dickerson", last_name: "Macdonald" },
      { age: 21, first_name: "Larsen", last_name: "Shaw" },
      { age: 89, first_name: "Geneva", last_name: "Wilson" },
      { age: 38, first_name: "Jami", last_name: "Carney" },
    ],
    msg: "Welcome to Your Vue.js App",
    client: {
      first_name: "",
      last_name: "",
      dob: "",
      phone: "",
      email: "",
      address: "",
      payments: [{}],
    },
    clients: [],
  },
  getters: {},
  actions: {
    async loadClients({ commit }) {
      try {
        let clientsData = await ClientsApiServices.getClients();
        clientsData = clientsData.data;
        commit("SAVE_CLIENTS", clientsData);
      } catch (error) {
        console.log("ERROR_GET_CLIENTS", error);
        throw error;
      }
    },
  },
  mutations: {
    SAVE_CLIENTS(state, clients) {
      state.clients = clients;
    },
  },
  modules: {},
});
