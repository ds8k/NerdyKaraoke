Ext.define('NerdyKaraoke.store.Karaoke', {
    extend: 'Ext.data.Store',

    config: {
		autoLoad: true,
		model: 'NerdyKaraoke.model.Songs',
		sorters: 'Title',
		grouper: 'Artist',
        proxy: {
            type: 'ajax',
            url: 'karaoke.json',

            reader: {
                type: 'json',
                rootProperty: 'karaoke',
                totalProperty: 'totalCount'
            }
        },

	    listeners: {
	        load: {
	            fn: function(){
	                Ext.Viewport.unmask();
	            }
	        }
	    }
    }
});
