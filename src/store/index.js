import Vue from "vue";
import Vuex from "vuex";
import ClientsApiServices from "@/components/services/clients-api-services";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    client_id: null,
    clients: [],
  },
  getters: {
    CLIENT_INFORMATION(state) {
      return state.client_id;
    },
    CLIENT_DATA(state) {
      return state.clients;
    },
  },
  actions: {
    async loadClients({ commit }) {
      try {
        let clientsData = await ClientsApiServices.getClients();
        clientsData = clientsData.data;
        commit("GET_CLIENTS", clientsData);
      } catch (error) {
        console.log("ERROR_GET_CLIENTS", error);
        throw error;
      }
    },
    async getClient({ commit }, payload) {
      commit("GET_CLIENT_ID", payload);
    },
    async updateClient({ commit }) {
      try {
        let clientsData = await ClientsApiServices.UpdateClientWithPayments();
        clientsData = clientsData.data;
        commit("SAVE_CLIENTS", clientsData);
      } catch (error) {
        console.log("ERROR_GET_CLIENTS", error);
        throw error;
      }
    },
    async createClient({ commit }) {
      try {
        let clientData = await ClientsApiServices.createClient();
        clientData = clientData.data;
        commit("SAVE_CLIENT", clientData);
      } catch (error) {
        console.log("ERROR_CREATE_CLIENT", error);
      }
    },
  },
  mutations: {
    SET_CLIENT_ID(state) {
      state.client_id = null;
    },
    GET_CLIENTS(state, clients) {
      state.clients = clients;
    },
    DELETE_CLIENT(state, id) {
      state.clients = state.clients.filter((client) => client.id !== id);
    },
    GET_CLIENT_ID(state, client_id) {
      state.client_id = client_id;
    },
    SAVE_CLIENT(state, payload) {
      state.clients.push(payload);
      let client = state.clients.find((client) => client.id === payload.id);
      client.total_amount = payload.payments.reduce(function (acc, obj) {
        return acc + Number(obj.amount);
      }, 0);
      client.total_payments = payload.payments.length;
      client.full_name = payload.first_name + " " + payload.last_name;
    },
    UPDATE_CLIENT(state, payload) {
      let clientObj = state.clients.find((client) => client.id === payload.id);
      clientObj.total_amount = payload.payments.reduce(function (acc, obj) {
        return acc + Number(obj.amount);
      }, 0);
      clientObj.dob = payload.dob;
      clientObj.phone = payload.phone;
      clientObj.email = payload.email;
      clientObj.address = payload.address;
      clientObj.total_payments = payload.payments.length;
      clientObj.full_name = payload.first_name + " " + payload.last_name;
    },
  },
  modules: {},
});
