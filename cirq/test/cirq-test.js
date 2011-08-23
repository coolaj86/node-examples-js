(function () {
  "use strict";

  var assert = require('assert')
    , CirQ = require(__dirname + '/../lib/cirq')
    , cirq
    ;

  cirq = new CirQ(4);

  assert.ok(undefined === cirq.pop());
  assert.ok(undefined === cirq.pop());

  cirq.push('a');
  cirq.push('b');
  cirq.push('c');

  assert.deepEqual(['a','b','c'], cirq.toArray());

  assert.strictEqual('a', cirq.pop());
  assert.strictEqual('b', cirq.pop());
  assert.strictEqual('c', cirq.pop());
  assert.ok(undefined === cirq.pop());
  assert.ok(undefined === cirq.pop());

  cirq.push('d');
  cirq.push('e');
  cirq.push('f');
  cirq.push('g');

  assert.deepEqual(['d','e','f', 'g'], cirq.toArray());

  assert.strictEqual('d', cirq.pop());
  assert.strictEqual('e', cirq.pop());
  assert.strictEqual('f', cirq.pop());
  assert.strictEqual('g', cirq.pop());
  assert.ok(undefined === cirq.pop());
  assert.ok(undefined === cirq.pop());

  cirq.push('h'); // gets overwritten
  cirq.push('i');
  cirq.push('j');
  cirq.push('k');
  cirq.push('l');

  assert.strictEqual('i', cirq.pop());
  assert.strictEqual('j', cirq.pop());
  assert.strictEqual('k', cirq.pop());
  assert.strictEqual('l', cirq.pop());
  assert.ok(undefined === cirq.pop());
  assert.ok(undefined === cirq.pop());

  cirq.push('m'); // overwritten
  cirq.push('n'); //
  cirq.push('o'); //
  cirq.push('p'); //
  cirq.push('q');
  cirq.push('r');
  cirq.push('s');
  cirq.push('t');

  assert.deepEqual(['q','r','s', 't'], cirq.toArray());

  assert.strictEqual('q', cirq.pop());
  assert.strictEqual('r', cirq.pop());
  assert.strictEqual('s', cirq.pop());
  assert.strictEqual('t', cirq.pop());
  assert.ok(undefined === cirq.pop());
  assert.ok(undefined === cirq.pop());

  // might as well go to z
  cirq.push('u');
  assert.strictEqual('u', cirq.pop());
  cirq.push('v');
  assert.strictEqual('v', cirq.pop());
  cirq.push('w');
  assert.strictEqual('w', cirq.pop());
  cirq.push('x');
  assert.strictEqual('x', cirq.pop());
  cirq.push('y');
  assert.strictEqual('y', cirq.pop());
  cirq.push('z');
  assert.strictEqual('z', cirq.pop());

  console.log('PASS');
}());
