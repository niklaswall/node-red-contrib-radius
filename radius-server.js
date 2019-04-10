var radius = require('radius')
var dgram = require('dgram')

module.exports = function(RED) {
  function RadiusServerNode(n) {
    RED.nodes.createNode(this, n)
    var node = this
    node.port = n.port
    node.secret = n.secret
    node.callback = (err, msg) => {}

    node.server = dgram.createSocket('udp4')

    node.server.on('message', function(msg, rinfo) {
      try {
        var packet = radius.decode({packet: msg, secret: node.secret})
        node.callback(null, {
          topic: packet.code,
          payload: packet,
          rinfo: rinfo,
        })
      } catch (error) {
        node.error(error)
        node.callback(error, null)
      }
    })

    node.server.on('listening', function() {
      var address = node.server.address()
      node.log('RADIUS server listening ' + address.address + ':' + address.port)
    })

    this.on('close', function(done) {
      node.server.close(() => {
        node.log('RADIUS socket closed')
        done()
      })
    })

    node.server.bind(node.port)

    this.listen = function(callback) {
      node.callback = callback
    }

    this.send = function(msg) {
      var response = radius.encode_response({
        packet: msg.payload,
        secret: node.secret,
        code: msg.payload.code,
        attributes: msg.payload.attributes,
      })

      node.server.send(response, 0, response.length, msg.rinfo.port, msg.rinfo.address, function(err, bytes) {
        if (err) {
          node.error('Error sending response to ', msg.rinfo)
          node.error(err)
        }
      })
    }
  }

  RED.nodes.registerType('radius-server', RadiusServerNode)
}
