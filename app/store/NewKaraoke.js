Ext.define('NerdyKaraoke.store.NewKaraoke', {
    extend: 'Ext.data.Store',

    config: {
		autoLoad: true,
		model: 'NerdyKaraoke.model.NewSongs',
		sorters: 'Artist',
        proxy: {
            noCache: true,
            enablePagingParams: false,
            type: 'ajax',
            url: 'new.json',

            reader: {
                type: 'json',
                rootProperty: 'karaoke'
            }
        },
        grouper: {
            sortProperty: 'index',
            groupFn: function(record) {
                return record.get('addNew');
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
