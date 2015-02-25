Ext.define('NerdyKaraoke.store.Requests', {
    extend: 'Ext.data.Store',

    config: {
    	autoLoad: true,
    	model: 'NerdyKaraoke.model.Songs',
    	proxy: {
    		type: 'ajax',
    		url: 'requests.json',

    		reader: {
    			type: 'json',
    			rootProperty: 'requests'
    		}
    	}
    }
});
