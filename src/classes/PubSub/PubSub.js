/** Use symbols to prevent exposing private attributes */
const _subscriptions = Symbol('subscriptions')
const _lastSubscriptionId = Symbol('lastSubscriptionId')

/**
 * Class to enable implementation of publish/subscribe pattern
 * @class
 * @classdesc Enables publishing/subscribing
 */
export default class PubSub {
  constructor() {
    this[_subscriptions] = {}
    this[_lastSubscriptionId] = 0
  }

  /**
   * Adds a subscription callback to the provided event name
   * @param {string} eventName Event name that will trigger the callback
   * @param {Function} callback Function to be executed when event is published
   * @returns {void}
   */
  subscribe(eventName, callback) {
    if (typeof callback !== 'function') {
      throw new Error('The provided callback must be a function')
    }

    if (!this[_subscriptions].hasOwnProperty(eventName)) {
      this[_subscriptions][eventName] = {}
    }

    const subscriptionId = `sub${this[_lastSubscriptionId]++}`
    this[_subscriptions][eventName][subscriptionId] = callback
  }

  /**
   * Removes a subscription callback for the provided event name
   * @param {string} eventName Event name for the registered callback
   * @param {Function} [callback] Function to have its subscription removed
   * @returns {void}
   */
  unsubscribe(eventName, callback) {
    const callbacks = this[_subscriptions][eventName] || {}
    for (let subscriptionId in callbacks) {
      if (!callback) {
        delete callbacks[subscriptionId]
      } else if (callbacks[subscriptionId] === callback) {
        delete callbacks[subscriptionId]
      }
    }
  }

  /**
   * Trigger all registered subscription callbacks for a specific event name
   * @param {String} eventName Event name to trigger subscriptions from
   * @param {any} [payload] Payload that will be passed to the callback function
   * @returns {void}
   */
  publish(eventName, ...payload) {
    const callbacks = this[_subscriptions][eventName] || {}
    for (let subscriptionId in callbacks) {
      callbacks[subscriptionId](...payload)
    }
  }

  /**
   * Clears all subscriptions for current instance
   * @returns {void}
   */
  unsubscribeFromAll() {
    for (let eventName in this[_subscriptions]) {
      const callbacks = this[_subscriptions][eventName]
      for (let subscriptionId in callbacks) {
        delete callbacks[subscriptionId]
      }
    }
  }
}
