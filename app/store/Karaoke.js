Ext.define('NerdyKaraoke.store.Karaoke', {
    extend: 'Ext.data.Store',
    requires: ['NerdyKaraoke.model.Songs'],

    config: {
		autoLoad: true,
		model: 'NerdyKaraoke.model.Songs',
        proxy: {
            type: 'ajax',
            url: 'resources/karaoke.json',

            reader: {
                type: 'json',
                rootProperty: 'karaoke'
            }
        },
        sorters: 'Title',

	    grouper: {
	        groupFn: function (item) {
	            return item.get('Artist');
	        }
	    },

	    listeners: {
	        load: {
	            fn: function(){
	                Ext.Viewport.unmask()
	            }
	        }
	    }
    }
});