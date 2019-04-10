module.exports = function(RED) {
  function RadiusRequest(config) {
    RED.nodes.createNode(this, config)
    var node = this

    this.name = config.name
    this.server = RED.nodes.getNode(config.server)

    this.server.listen((err, msg) => {
      if (msg != null) node.send(msg)
    })
  }
  RED.nodes.registerType('radius-request', RadiusRequest)
}
