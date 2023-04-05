const Store = require('electron-store');
const schema = {
    app_name: {
        type: 'string',
        default: 'urifu'
    },
    mqtt_server: {
      type: 'string',
      default: 'mqtt://pinode.local'
    },
    mqtt_link_topic: {
      type: 'string',
      default: 'link'
    },
    main_background_color: {
      type: 'string',
      default: '#2e2c29'
    },
    initial_window_width: {
      type: 'number',
      default: 1366
    },
    initial_window_height: {
      type: 'number',
      default: 768
    }
};

const store = new Store({schema});
const app_name = store.get('app_name')
const mqtt_server = store.get('mqtt_server');
const mqtt_link_topic = store.get('mqtt_link_topic');
const main_background_color = store.get('main_background_color')
const initial_window_width = store.get('initial_window_width')
const initial_window_height = store.get('initial_window_height')

module.exports = {
    app_name: app_name,
    mqtt_server: mqtt_server,
    mqtt_link_topic: mqtt_link_topic,
    main_background_color: main_background_color,
    initial_window_width: initial_window_width,
    initial_window_height: initial_window_height
}