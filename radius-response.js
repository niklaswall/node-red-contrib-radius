module.exports = function(RED) {
  function RadiusResponse(config) {
    RED.nodes.createNode(this, config)
    var node = this

    this.name = config.name
    this.server = RED.nodes.getNode(config.server)

    node.on('input', function(msg) {
      this.server.send(msg)
    })
  }
  RED.nodes.registerType('radius-response', RadiusResponse)
}
