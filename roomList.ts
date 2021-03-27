export default {
  rooms: [],
  push(room) {
    this.rooms.push(room);
  },
  getAll() {
    return this.rooms;
  },
  getById(id) {
    return this.rooms.find((room) => room.id === id);
  },
};
