export default (id) => ({
  id,
  peers: [],
  push(peer) {
    this.peers.push(peer);
  },
  getPeers() {
    return this.peers;
  },
  getMaster() {
    return this.peers[0];
  },
  getPeerById(id) {
    return this.peers.find((peer) => peer.id === id);
  },
});
