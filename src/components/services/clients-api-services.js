import http from "../../core/services/http-common";

class ClientsApiServices {
  getClients() {
    return http.get("/clients");
  }
  createClient(data) {
    return http.post("/clients", data);
  }
  createClientWithPayment(data) {
    return http.post("/clients", data);
  }

  deleteClient(id) {
    return http.delete(`/clients/${id}`);
  }
  UpdateClientWithPayments(data, id) {
    return http.put(`/clients/${id}`, data);
  }
  getClientById(id) {
    return http.get(`/clients/${id}`);
  }
}
export default new ClientsApiServices();
