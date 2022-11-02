import http from "../../core/services/http-common";

class ClientsApiServices {
  getClients() {
    return http.get("/clients");
  }
  createClient(data) {
    return http.post("/clients", data);
  }
  deleteClient(id) {
    return http.delete(`/clients/${id}`);
  }
  deletePayment(id) {
    return http.delete(`/payment/${id}`);
  }
  UpdateClientWithPayments(data) {
    return http.post(`/update-clients/`, data);
  }
  getClientById(id) {
    return http.get(`/clients/${id}`);
  }
}
export default new ClientsApiServices();
