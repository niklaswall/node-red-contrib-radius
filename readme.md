# Node-Red RADIUS Node

node-red-contrib-node-radius

This is a first version of rough RADIUS nodes for node-red.

Can easily be used to do RADIUS authentication and accounting in node-red, but the nodes themself mainly focus on protocol level functionality, so the details are up to you.

## Example workflow

Example authentication and accounting flows.

```
[ { "id": "78558f05.470e6", "type": "radius-request", "z": "2c4088be.642158", "server": "6bc2abc.e010054", "name": "", "x": 140, "y": 680, "wires": [ [ "b0bdae77.f3723", "7791e9b4.ed9048" ] ] }, { "id": "272fb8a7.54a368", "type": "radius-response", "z": "2c4088be.642158", "server": "6bc2abc.e010054", "name": "", "x": 520, "y": 680, "wires": [] }, { "id": "b0bdae77.f3723", "type": "function", "z": "2c4088be.642158", "name": "Authenticate", "func": "if(msg.topic != 'Access-Request')\n return;\n \nvar username = msg.payload.attributes['User-Name'];\nvar password = msg.payload.attributes['User-Password'];\n\nvar users = [\n {username: 'niklas', password:'monkey123', groups: 'users, adults, topsecret'},\n {username: 'linda', password:'monkey123', groups: 'users, adults'},\n {username: 'vilmer', password:'summer123', groups: 'users, children'},\n {username: 'ellie', password:'summer123', groups: 'users, children'},\n {username: 'elicia', password:'summer123', groups: 'users, children'},\n ];\n\n\nvar authenticated = users.some((user) => {\n if(user.username.toLowerCase() == username.toLowerCase() && user.password == password) {\n msg.payload.code = 'Access-Accept';\n msg.payload.attributes = [\n // ['Session-Timeout', 600],\n ['Idle-Timeout', 3600],\n ['Vendor-Specific', 5089, [[1, user.groups]]]\n ];\n\n node.status({fill:\"green\",shape:\"dot\",text:user.username + ' authenticated.'}); \n node.send(msg);\n return true;\n }\n return false;\n});\n\nif(!authenticated) {\n msg.payload.code = 'Access-Reject';\n msg.payload.attributes = [];\n this.status({fill:\"red\",shape:\"ring\",text: username + \" failed auth\"});\n \n return msg;\n}\n", "outputs": 1, "noerr": 0, "x": 330, "y": 640, "wires": [ [ "272fb8a7.54a368" ] ] }, { "id": "7791e9b4.ed9048", "type": "function", "z": "2c4088be.642158", "name": "Accounting", "func": "if(msg.topic != 'Accounting-Request')\n return;\n \n\nmsg.payload.code = 'Accounting-Response';\nmsg.payload.attributes = [];\n\nreturn [msg, null];", "outputs": 2, "noerr": 0, "x": 330, "y": 700, "wires": [ [ "272fb8a7.54a368" ], [] ] }, { "id": "6bc2abc.e010054", "type": "radius-server", "z": "", "port": "1812", "secret": "topsecret" } ]
```
