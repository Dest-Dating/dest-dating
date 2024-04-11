//  wrapper around the WebRTC API for handling peer connections, offers, and answers.
class PeerService {
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          // ICE framework to assist peers in establishing connections when they might be behind a firewall
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
  }

  /*
  getAnswer(offer):
    This method takes an offer object as a parameter, which represents an offer to establish a connection.
    It sets the remote description of the peer connection to the received offer using setRemoteDescription().
    Then, it creates an answer using createAnswer() method, which generates a response to the offer.
    The answer is set as the local description of the peer connection using setLocalDescription().
    Finally, it returns the generated answer.
  */

  async getAnswer(offer) {
    if (this.peer) {
      await this.peer.setRemoteDescription(offer);
      const ans = await this.peer.createAnswer();
      await this.peer.setLocalDescription(new RTCSessionDescription(ans));
      return ans;
    }
  }

  /*
    setLocalDescription(ans):
        This method takes an answer object as a parameter, which represents the answer to an offer.
        It sets the remote description of the peer connection to the received answer using setRemoteDescription().
  */

  async setLocalDescription(ans) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
    }
  }

  /*
    getOffer():
        This method is used to generate an offer for establishing a connection.
        It creates an offer using the createOffer() method, which initiates the process of establishing a connection.
        The generated offer is set as the local description of the peer connection using setLocalDescription().
        Finally, it returns the generated offer.
  */

  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer();
      await this.peer.setLocalDescription(new RTCSessionDescription(offer));
      return offer;
    }
  }
}

export default new PeerService();
