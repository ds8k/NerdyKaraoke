Ext.define('NerdyKaraoke.store.Karaoke', {
    extend: 'Ext.data.Store',

    config: {
		autoLoad: true,
		model: 'NerdyKaraoke.model.Songs',
		sorters: 'Title',
		grouper: 'Artist',
        proxy: {
            type: 'ajax',
            url: 'resources/karaoke.json',

            reader: {
                type: 'json',
                rootProperty: 'karaoke'
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